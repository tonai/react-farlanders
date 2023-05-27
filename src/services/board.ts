import type { IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { IBoardBlock, ILevelBlock, IMap } from "../types/map";

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

import { isBuildingBlock } from "./block";
import { getMapBlock, getMapBlockSid } from "./map";

function getBackground(
  imageMap: Map<number, IImage>,
  block: IBlock,
  x: number,
  y: number
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

function getBackgrounds(
  imageMap: Map<number, IImage>,
  map: IBoardBlock,
  x: number,
  y: number
): (string | null)[] | string | null {
  const mapItem = map[y][x];
  if (mapItem instanceof Array) {
    return mapItem
      .slice()
      .reverse()
      .map((block) => getBackground(imageMap, block, x, y))
      .filter((x) => x)
      .join(",");
  }
  return getBackground(imageMap, mapItem, x, y);
}

export function getBackgroundArray(
  imageMap: Map<number, IImage>,
  board: IBoardBlock
): string[] {
  const land = [...board];
  return land
    .map((line, j) =>
      line.map((_, i: number) =>
        getBackgrounds(imageMap, board, i, land.length - j - 1)
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
  level: ILevelBlock,
  x: number,
  y: number,
  selectedBuilding: IBuildingBlock
): boolean {
  const building = getMapBlock(level.buildings[x][y]);
  const land = getMapBlock(level.land[x][y]);
  const landformOnly =
    POWER_LINES_SIDS.includes(selectedBuilding.sid) ||
    PIPES_SIDS.includes(selectedBuilding.sid);
  return (
    isBuildingCorrect(selectedBuilding, building?.sid, landformOnly) &&
    isLandCorrect(selectedBuilding, land?.sid)
  );
}

export function isRemovable(
  level: ILevelBlock,
  x: number,
  y: number,
  boardKey: View = View.Buildings
): boolean {
  if (boardKey === View.Buildings) {
    const block = getMapBlock(level[boardKey][x][y]);
    return buildingBlocksMap.has(block?.sid ?? 0) && block?.sid !== BASE_SID;
  }
  const sid = getMapBlockSid(level[boardKey][x][y]);
  return sid !== 0;
}

export function getBase(map: IMap): IPoint | undefined {
  return map[0].buildings.reduce<IPoint | undefined>((acc, row, x) => {
    const y = row.findIndex((block) => getMapBlockSid(block) === BASE_SID);
    if (y !== -1) {
      return { x, y };
    }
    return acc;
  }, undefined);
}
