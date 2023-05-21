import type { IBlock, IBlockMap, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { ILevel } from "../types/map";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";

function getBackground(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  map: (number[] | number)[][],
  x: number,
  y: number
): string | null {
  const mapItem = map[y][x];
  const sid: number =
    mapItem instanceof Array ? (mapItem.at(-1) as number) : mapItem;
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

export function getBackgroundArray(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  board: (number[] | number)[][]
): string[] {
  const land = [...board];
  return land
    .map((line, j) =>
      line.map((_, i) =>
        getBackground(blockMap, imageMap, board, i, land.length - j - 1)
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
  const buildings = level.buildings[y - 1][x];
  const building =
    buildings instanceof Array ? (buildings.at(-1) as number) : buildings;
  const land = level.land[y - 1][x];
  const landform = level.landforms[y - 1][x];
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
