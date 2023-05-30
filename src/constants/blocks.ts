import type {
  IBlockCategories,
  IBlocks,
  IBuildingBlocks,
} from "../types/block";

import rawBuildingBlocks from "../data/building-blocks.json";
import rawBuildingCategories from "../data/buildings-categories.json";
import rawLandBlocks from "../data/land-blocks.json";

export const DISABLED_BLOCK_URL = "/assets/disabled.png";
export const HYDRATED_BLOCK_URL = "/assets/natural/land/fertile-soil1.png";

export const BLOCK_SIZE = 64;

export const GROUND_SID = 2;
export const ANOMALY_SIDS = [11, 15, 18];
export const MOUNTAIN_SID = 16;
export const WATER_SID = 20;
export const BASE_SID = 130;
export const POWER_LINES_SID = 100;
export const REINFORCED_POWER_LINES_SID = 101;
export const POWER_LINES_SIDS = [POWER_LINES_SID, REINFORCED_POWER_LINES_SID];
export const PIPES_SID = 102;
export const REINFORCED_PIPES_SID = 103;
export const PIPES_SIDS = [PIPES_SID, REINFORCED_PIPES_SID];
export const TUNNEL_SID = 104;

export const landBlocks = rawLandBlocks as IBlocks;
export const buildingBlocks = rawBuildingBlocks as IBuildingBlocks;
export const categories = rawBuildingCategories as IBlockCategories;
export const blocks = landBlocks.concat(buildingBlocks);

export const landBlockMap = new Map(
  landBlocks.map((block) => [block.sid, block])
);
export const buildingBlocksMap = new Map(
  buildingBlocks.map((block) => [block.sid, block])
);
export const blockMap = new Map(blocks.map((block) => [block.sid, block]));
export const blockCategoryMap = buildingBlocks.reduce((acc, block) => {
  if (acc.has(block.category)) {
    acc.get(block.category)?.push(block);
  } else {
    acc.set(block.category, [block]);
  }
  return acc;
}, new Map<string, IBuildingBlocks>());
