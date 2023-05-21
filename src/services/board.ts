import type { IBlock, IBuildingBlock } from "../types/block";
import type { IImage } from "../types/image";
import type { IBlockBoard, IBlockLevel } from "../types/map";

import {
  BLOCK_OFFSET,
  BLOCK_SIZE,
  DISABLED_BLOCK_URL,
  buildingBlocksMap,
} from "../constants/blocks";

import { isBuildingBlock } from "./block";
import { getMapBlock } from "./map";

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
  if (isBuildingBlock(block) && block.states) {
    backgrounds.push(
      `${x * BLOCK_SIZE}px ${
        (y + 2) * BLOCK_SIZE - image.height
      }px no-repeat url(${DISABLED_BLOCK_URL})`
    );
  }
  backgrounds.push(
    `${x * BLOCK_SIZE}px ${
      (y + 2) * BLOCK_SIZE - BLOCK_OFFSET - image.height
    }px no-repeat url(${block.images})`
  );
  return backgrounds.join(",");
}

function getBackgrounds(
  imageMap: Map<number, IImage>,
  map: IBlockBoard,
  x: number,
  y: number
): (string | null)[] | string | null {
  const mapItem = map[y][x];
  if (mapItem instanceof Array) {
    return mapItem
      .slice()
      .reverse()
      .map((block) => getBackground(imageMap, block, x, y))
      .filter((x) => x);
  }
  return getBackground(imageMap, mapItem, x, y);
}

export function getBackgroundArray(
  imageMap: Map<number, IImage>,
  board: IBlockBoard
): string[] {
  const land = [...board];
  return land
    .map((line, j) =>
      line.map((_, i) =>
        getBackgrounds(imageMap, board, i, land.length - j - 1)
      )
    )
    .flat()
    .filter((x) => x) as string[];
}

export function isBuildingCorrect(
  selectedBuilding: IBuildingBlock,
  building = 0
): boolean {
  return selectedBuilding.conditions.buildings
    ? selectedBuilding.conditions.buildings.includes(building)
    : building === 0;
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
  level: IBlockLevel,
  x: number,
  y: number,
  selectedBuilding: IBuildingBlock
): boolean {
  const building = getMapBlock(level.buildings[x][y]);
  const land = getMapBlock(level.land[x][y]);
  return (
    isBuildingCorrect(selectedBuilding, building?.sid) &&
    isLandCorrect(selectedBuilding, land?.sid)
  );
}

export function isRemovable(level: IBlockLevel, x: number, y: number): boolean {
  const building = getMapBlock(level.buildings[x][y]);
  return buildingBlocksMap.has(building?.sid ?? 0);
}
