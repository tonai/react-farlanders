import type { IBlock, IBuildingBlock } from "../types/block";

export function isBuildingBlock(block: IBlock): block is IBuildingBlock {
  return "category" in block;
}
