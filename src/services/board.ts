import type { BlockError, IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { IBoardBlock, ICellBlock, IMap } from "../types/map";
import type { IResources } from "../types/resources";

import {
  BASE_SID,
  BLOCK_SIZE,
  BUILDABLE_BLOCK_URL,
  DISABLED_BLOCK_URL,
  GROUND_HYDRATOR_SID,
  HYDRATED_BLOCK_URL,
  PIPES_SIDS,
  POWER_LINES_SIDS,
} from "../constants/blocks";
import { BlockState } from "../types/block";
import { View } from "../types/game";
import { DrawableCellType } from "../types/map";

import { hasState, isBlocks, isBuildingBlock, isSid } from "./block";
import { getCellBlock, getCellBlockSid } from "./map";
import { getCost } from "./resources";
import { subtractResources } from "./utils";

export function isBuildingCorrect(
  selectedBuilding: IBuildingBlock,
  cell: ICellBlock
): boolean {
  const buildingSid = getCellBlock(cell.buildings)?.sid ?? 0;
  return selectedBuilding.conditions.buildings
    ? selectedBuilding.conditions.buildings.includes(buildingSid)
    : buildingSid === 0 ||
        (buildingSid === GROUND_HYDRATOR_SID &&
          selectedBuilding.sid !== GROUND_HYDRATOR_SID);
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
    (!selectedBuilding.conditions.state ||
      hasState(landBlock, selectedBuilding.conditions.state))
  );
}

export function hasResources(
  selectedBuilding: IBuildingBlock,
  cell: ICellBlock,
  resources: IResources
): boolean {
  const cost = getCost(selectedBuilding, cell);
  return Object.values(subtractResources(resources, cost)).every(
    (value) => value >= 0
  );
}

export function isBuildable(
  cell: ICellBlock,
  selectedBuilding: IBuildingBlock,
  resources?: IResources
): boolean {
  let isBuildable = isLandCorrect(selectedBuilding, cell);
  if (
    !POWER_LINES_SIDS.includes(selectedBuilding.sid) &&
    !PIPES_SIDS.includes(selectedBuilding.sid)
  ) {
    isBuildable &&= isBuildingCorrect(selectedBuilding, cell);
  }
  if (resources) {
    isBuildable &&= hasResources(selectedBuilding, cell, resources);
  }
  return isBuildable;
}

function getBlockBackground(
  imageMap: Map<number, IImage>,
  board: IBoardBlock,
  i: number,
  j: number,
  selectedBuilding?: IBuildingBlock,
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
  if (selectedBuilding && isBuildable(board[i][j], selectedBuilding)) {
    backgrounds.push(
      `${j * BLOCK_SIZE}px ${
        (i + 1) * BLOCK_SIZE
      }px no-repeat url(${BUILDABLE_BLOCK_URL})`
    );
  }
  if (isBuildingBlock(block) && (block.errors?.length ?? 0) > 0) {
    backgrounds.push(
      `${j * BLOCK_SIZE}px ${
        (i + 1) * BLOCK_SIZE
      }px no-repeat url(${DISABLED_BLOCK_URL})`
    );
  }
  if (hasState(block, BlockState.Hydrated)) {
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
  board: IBoardBlock,
  i: number,
  j: number,
  selectedBuilding?: IBuildingBlock,
  blocks?: IBlock | IBlock[]
): string | null {
  if (!blocks) {
    return null;
  }
  if (blocks instanceof Array) {
    return blocks
      .slice()
      .reverse()
      .map((block) =>
        getBlockBackground(imageMap, board, i, j, selectedBuilding, block)
      )
      .filter((x) => x)
      .join(",");
  }
  return getBlockBackground(imageMap, board, i, j, selectedBuilding, blocks);
}

function getCellBackground(
  imageMap: Map<number, IImage>,
  board: IBoardBlock,
  i: number,
  j: number,
  selectedBuilding?: IBuildingBlock,
  types: DrawableCellType[] = [DrawableCellType.Land]
): string | null {
  const cell = board[i][j];
  return types
    .map((type) =>
      getBlocksBackground(imageMap, board, i, j, selectedBuilding, cell[type])
    )
    .filter((x) => x)
    .join(",");
}

export function getBackgroundArray(
  imageMap: Map<number, IImage>,
  board: IBoardBlock,
  selectedBuilding?: IBuildingBlock,
  types: DrawableCellType[] = [DrawableCellType.Land]
): string[] {
  const land = [...board];
  return land
    .map((row, i) =>
      row.map((_, j: number) =>
        getCellBackground(
          imageMap,
          board,
          land.length - i - 1,
          j,
          selectedBuilding,
          types
        )
      )
    )
    .flat()
    .filter((x) => x) as string[];
}

export function isRemovable(
  cell: ICellBlock,
  type: View = View.Buildings
): boolean {
  const blocks = cell[type];
  if (isBlocks(blocks)) {
    const blockSid = getCellBlock(blocks)?.sid ?? 0;
    return blockSid !== 0 && blockSid !== BASE_SID;
  } else if (isSid(blocks)) {
    const sid = getCellBlockSid(blocks);
    return sid !== 0;
  }
  const tunnel = getCellBlock(cell.tunnel);
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
