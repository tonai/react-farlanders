import type {
  IBlockCategories,
  IBlocks,
  IBuildingBlock,
  IBuildingBlocks,
} from "../types/block";

import rawBuildingBlocks from "../data/building-blocks.json";
import rawBuildingCategories from "../data/buildings-categories.json";
import rawLandBlocks from "../data/land-blocks.json";

export const DISABLED_BLOCK_URL = "/assets/disabled.png";
export const BUILDABLE_BLOCK_URL = "/assets/buildable.png";
export const HYDRATED_BLOCK_URL = "/assets/natural/land/fertile-soil1.png";
export const RESOURCE_PATH = "/assets/resources/";

export const BLOCK_SIZE = 64;

export const GROUND_SID = 2;
export const ANOMALY_SIDS = [11, 15, 18];
export const MOUNTAIN_SID = 16;
export const WATER_SID = 20;
export const POWER_LINES_SID = 100;
export const REINFORCED_POWER_LINES_SID = 101;
export const POWER_LINES_SIDS = [POWER_LINES_SID, REINFORCED_POWER_LINES_SID];
export const PIPES_SID = 102;
export const REINFORCED_PIPES_SID = 103;
export const PIPES_SIDS = [PIPES_SID, REINFORCED_PIPES_SID];
export const TUNNEL_SID = 104;
export const GROUND_HYDRATOR_SID = 126;
export const WATER_DISPENSER_SID = 127;
export const BASE_SID = 130;
export const DRYERS = [150, 152, 154];
export const SPACEPORTS = [BASE_SID, 163];
export const BIO_STOREHOUSE_SID = 180;

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

export const powerLinesBlock = buildingBlocksMap.get(
  POWER_LINES_SID
) as IBuildingBlock;
export const reinforcedPowerLinesBlock = buildingBlocksMap.get(
  REINFORCED_POWER_LINES_SID
) as IBuildingBlock;
export const pipesBlock = buildingBlocksMap.get(PIPES_SID) as IBuildingBlock;
export const reinforcedPipesBlock = buildingBlocksMap.get(
  REINFORCED_PIPES_SID
) as IBuildingBlock;
export const tunnelBlock = buildingBlocksMap.get(TUNNEL_SID) as IBuildingBlock;
