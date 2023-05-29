import type { IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { IBoardBlock, IMap } from "../types/map";

import {
  BASE_SID,
  BLOCK_SIZE,
  DISABLED_BLOCK_URL,
  PIPES_SIDS,
  POWER_LINES_SIDS,
  TUNNEL_SID,
  buildingBlocksMap,
} from "../constants/blocks";
import { Connection } from "../types/block";
import { View } from "../types/game";
import { DrawableCellType } from "../types/map";

import { isBuildingBlock } from "./block";
import { getCellBlock, getCellBlockSid } from "./map";

function getBlockBackground(
  imageMap: Map<number, IImage>,
  x: number,
  y: number,
  block?: IBlock
): string | null {
  if (!block) {
    return null;
  }
  const image = imageMap.get(block.sid);
  if (!image) {
    return null;
  }
  const backgrounds = [];
  if (isBuildingBlock(block) && (block.states?.length ?? 0) > 0) {
    backgrounds.push(
      `${x * BLOCK_SIZE}px ${
        (y + 1) * BLOCK_SIZE
      }px no-repeat url(${DISABLED_BLOCK_URL})`
    );
  }
  backgrounds.push(
    `${x * BLOCK_SIZE}px ${
      (y + 2) * BLOCK_SIZE - image.height
    }px no-repeat url(${block.images})`
  );
  return backgrounds.join(",");
}

function getBlocksBackground(
  imageMap: Map<number, IImage>,
  x: number,
  y: number,
  blocks?: IBlock | IBlock[]
): string | null {
  if (!blocks) {
    return null;
  }
  if (blocks instanceof Array) {
    return blocks
      .slice()
      .reverse()
      .map((block) => getBlockBackground(imageMap, x, y, block))
      .filter((x) => x)
      .join(",");
  }
  return getBlockBackground(imageMap, x, y, blocks);
}

function getCellBackground(
  imageMap: Map<number, IImage>,
  board: IBoardBlock,
  x: number,
  y: number,
  types: DrawableCellType[] = [DrawableCellType.Land]
): string | null {
  const cell = board[y][x];
  return types
    .map((type) => getBlocksBackground(imageMap, x, y, cell[type]))
    .filter((x) => x)
    .join(",");
}

export function getBackgroundArray(
  imageMap: Map<number, IImage>,
  board: IBoardBlock,
  types: DrawableCellType[] = [DrawableCellType.Land]
): string[] {
  const land = [...board];
  return land
    .map((line, j) =>
      line.map((_, i: number) =>
        getCellBackground(imageMap, board, i, land.length - j - 1, types)
      )
    )
    .flat()
    .filter((x) => x) as string[];
}

export function isBuildingCorrect(
  selectedBuilding: IBuildingBlock,
  building = 0,
  landformOnly = false
): boolean {
  const buildCondition =
    (selectedBuilding.connections?.includes(Connection.Tunnel) &&
      building === TUNNEL_SID) ||
    (selectedBuilding.conditions.buildings
      ? selectedBuilding.conditions.buildings.includes(building)
      : building === 0);
  return (
    (!landformOnly && buildCondition) ||
    (landformOnly && (buildingBlocksMap.has(building) || buildCondition))
  );
}

export function isLandCorrect(
  selectedBuilding: IBuildingBlock,
  land = 0
): boolean {
  return (
    land === 0 || (selectedBuilding.conditions.land?.includes(land) ?? true)
  );
}

export function isBuildable(
  board: IBoardBlock,
  x: number,
  y: number,
  selectedBuilding: IBuildingBlock
): boolean {
  const building = getCellBlock(board[x][y].buildings);
  const land = getCellBlock(board[x][y].land);
  const landformOnly =
    POWER_LINES_SIDS.includes(selectedBuilding.sid) ||
    PIPES_SIDS.includes(selectedBuilding.sid);
  return (
    isBuildingCorrect(selectedBuilding, building?.sid, landformOnly) &&
    isLandCorrect(selectedBuilding, land?.sid)
  );
}

export function isRemovable(
  board: IBoardBlock,
  x: number,
  y: number,
  type: View = View.Buildings
): boolean {
  if (type === View.Buildings) {
    const block = getCellBlock(board[x][y][type]);
    return buildingBlocksMap.has(block?.sid ?? 0) && block?.sid !== BASE_SID;
  }
  const sid = getCellBlockSid(board[x][y][type]);
  return sid !== 0;
}

export function getBase(map: IMap): IPoint | undefined {
  return map[0].reduce<IPoint | undefined>((acc, row, x) => {
    const y = row.findIndex(
      (cell) => getCellBlockSid(cell.buildings) === BASE_SID
    );
    if (y !== -1) {
      return { x, y };
    }
    return acc;
  }, undefined);
}
