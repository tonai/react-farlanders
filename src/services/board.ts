import type { IBlock, IBlockMap, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { IBoard, ILevel } from "../types/map";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";

import { getMapBlockSid } from "./map";

function getBackground(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  sid: number,
  x: number,
  y: number
): string | null {
  if (!sid) {
    return null;
  }
  const block = blockMap.get(sid);
  if (!block) {
    return null;
  }
  const image = imageMap.get(block);
  if (!image) {
    return null;
  }
  return `${x * BLOCK_SIZE}px ${
    (y + 2) * BLOCK_SIZE - BLOCK_OFFSET - image.height
  }px no-repeat url(${block.images})`;
}

function getBackgrounds(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  map: IBoard,
  x: number,
  y: number
): (string | null)[] | string | null {
  const mapItem = map[y][x];
  if (mapItem instanceof Array) {
    return mapItem
      .slice()
      .reverse()
      .map((sid) => getBackground(blockMap, imageMap, sid, x, y));
  }
  return getBackground(blockMap, imageMap, mapItem, x, y);
}

export function getBackgroundArray(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  board: IBoard
): string[] {
  const land = [...board];
  return land
    .map((line, j) =>
      line.map((_, i) =>
        getBackgrounds(blockMap, imageMap, board, i, land.length - j - 1)
      )
    )
    .flat()
    .filter((x) => x) as string[];
}

export function isBuildable(
  level: ILevel,
  point: IPoint,
  selectedBuilding: IBuildingBlock
): boolean {
  const { x, y } = point;
  const building = getMapBlockSid(level.buildings[y - 1][x]) as number;
  const land = getMapBlockSid(level.land[y - 1][x]) as number;
  const landform = getMapBlockSid(level.landforms[y - 1][x]) as number;
  const buildingCondition = selectedBuilding.conditions.buildings
    ? selectedBuilding.conditions.buildings.includes(building)
    : building === 0;
  const landCondition =
    land === 0 || (selectedBuilding.conditions.land?.includes(land) ?? true);
  const landformCondition =
    landform === 0 ||
    (selectedBuilding.conditions.landform?.includes(landform) ?? true);
  return buildingCondition && landCondition && landformCondition;
}
