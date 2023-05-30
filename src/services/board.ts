import type { BlockError, IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { IBoardBlock, ICellBlock, IMap } from "../types/map";

import {
  BASE_SID,
  BLOCK_SIZE,
  DISABLED_BLOCK_URL,
  GROUND_HYDRATOR_SID,
  HYDRATED_BLOCK_URL,
  PIPES_SIDS,
  POWER_LINES_SIDS,
} from "../constants/blocks";
import { View } from "../types/game";
import { DrawableCellType } from "../types/map";

import { isBlocks, isBuildingBlock, isHydrated, isSid } from "./block";
import { getCellBlock, getCellBlockSid } from "./map";

function getBlockBackground(
  imageMap: Map<number, IImage>,
  i: number,
  j: number,
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
  if (isBuildingBlock(block) && (block.errors?.length ?? 0) > 0) {
    backgrounds.push(
      `${j * BLOCK_SIZE}px ${
        (i + 1) * BLOCK_SIZE
      }px no-repeat url(${DISABLED_BLOCK_URL})`
    );
  }
  if (isHydrated(block)) {
    backgrounds.push(
      `${j * BLOCK_SIZE}px ${
        (i + 1) * BLOCK_SIZE
      }px no-repeat url(${HYDRATED_BLOCK_URL})`
    );
  }
  backgrounds.push(
    `${j * BLOCK_SIZE}px ${
      (i + 2) * BLOCK_SIZE - image.height
    }px no-repeat url(${block.images})`
  );
  return backgrounds.join(",");
}

function getBlocksBackground(
  imageMap: Map<number, IImage>,
  i: number,
  j: number,
  blocks?: IBlock | IBlock[]
): string | null {
  if (!blocks) {
    return null;
  }
  if (blocks instanceof Array) {
    return blocks
      .slice()
      .reverse()
      .map((block) => getBlockBackground(imageMap, i, j, block))
      .filter((x) => x)
      .join(",");
  }
  return getBlockBackground(imageMap, i, j, blocks);
}

function getCellBackground(
  imageMap: Map<number, IImage>,
  board: IBoardBlock,
  i: number,
  j: number,
  types: DrawableCellType[] = [DrawableCellType.Land]
): string | null {
  const cell = board[i][j];
  return types
    .map((type) => getBlocksBackground(imageMap, i, j, cell[type]))
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
    .map((row, i) =>
      row.map((_, j: number) =>
        getCellBackground(imageMap, board, land.length - i - 1, j, types)
      )
    )
    .flat()
    .filter((x) => x) as string[];
}

export function isBuildingCorrect(
  selectedBuilding: IBuildingBlock,
  cell: ICellBlock
): boolean {
  const buildingSid = getCellBlock(cell.buildings)?.sid ?? 0;
  const buildCondition = selectedBuilding.conditions.buildings
    ? selectedBuilding.conditions.buildings.includes(buildingSid)
    : buildingSid === 0 || buildingSid === GROUND_HYDRATOR_SID;
  return buildCondition;
}

export function isLandCorrect(
  selectedBuilding: IBuildingBlock,
  cell: ICellBlock
): boolean {
  const landBlock = getCellBlock(cell.land) as IBlock;
  const landformBlockSid = getCellBlock(cell.landform)?.sid ?? 0;
  return (
    (selectedBuilding.conditions.land?.includes(landBlock.sid) ?? true) &&
    (selectedBuilding.conditions.landform
      ? selectedBuilding.conditions.landform.includes(landformBlockSid)
      : landformBlockSid === 0) &&
    (!selectedBuilding.conditions.hydrated || isHydrated(landBlock))
  );
}

export function isBuildable(
  board: IBoardBlock,
  i: number,
  j: number,
  selectedBuilding: IBuildingBlock
): boolean {
  if (
    POWER_LINES_SIDS.includes(selectedBuilding.sid) ||
    PIPES_SIDS.includes(selectedBuilding.sid)
  ) {
    return isLandCorrect(selectedBuilding, board[i][j]);
  }
  return (
    isBuildingCorrect(selectedBuilding, board[i][j]) &&
    isLandCorrect(selectedBuilding, board[i][j])
  );
}

export function isRemovable(
  board: IBoardBlock,
  i: number,
  j: number,
  type: View = View.Buildings
): boolean {
  const blocks = board[i][j][type];
  if (isBlocks(blocks)) {
    const blockSid = getCellBlock(blocks)?.sid ?? 0;
    return blockSid !== 0 && blockSid !== BASE_SID;
  } else if (isSid(blocks)) {
    const sid = getCellBlockSid(blocks);
    return sid !== 0;
  }
  const tunnel = getCellBlock(board[i][j].tunnel);
  return Boolean(tunnel);
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

export function getBuildingState(
  board: IBoardBlock,
  i: number,
  j: number
): BlockError | undefined {
  const building = getCellBlock(board[i][j].buildings);
  if (
    isBuildingBlock(building) &&
    building.errors &&
    building.errors?.length > 0
  ) {
    return building.errors[0];
  }
  return undefined;
}
