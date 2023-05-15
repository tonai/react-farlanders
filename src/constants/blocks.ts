import type {
  IBlockCategories,
  IBlocks,
  IBuildingBlocks,
} from "../types/block";

import rawBuildingBlocks from "../data/building-blocks.json";
import rawBuildingCategories from "../data/buildings-categories.json";
import rawLandBlocks from "../data/land-blocks.json";

export const BLOCK_SIZE = 64;
export const BLOCK_OFFSET = 6;

export const landBlocks = rawLandBlocks as IBlocks;
export const buildingBlocks = rawBuildingBlocks as IBuildingBlocks;
export const categories = rawBuildingCategories as IBlockCategories;

export const blocks = landBlocks.concat(buildingBlocks);
export const blockMap = new Map(blocks.map((block) => [block.sid, block]));
export const blockCategoryMap = buildingBlocks.reduce((acc, block) => {
  if (acc.has(block.category)) {
    acc.get(block.category)?.push(block);
  } else {
    acc.set(block.category, [block]);
  }
  return acc;
}, new Map<string, IBuildingBlocks>());
