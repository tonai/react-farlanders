import type { IBlock, IBuildingBlock, ILandBlock } from "../types/block";

import { BlockState } from "../types/block";

export function isBuildingBlock(block?: IBlock): block is IBuildingBlock {
  if (!block) {
    return false;
  }
  return "category" in block;
}

export function isHydrated(block: IBlock): boolean {
  if (((block as ILandBlock)?.states?.length ?? 0) > 0) {
    const states = (block as ILandBlock).states as BlockState[];
    return (
      states.includes(BlockState.Hydrated) && !states.includes(BlockState.Dry)
    );
  }
  return false;
}

export function isEnabled(block: IBuildingBlock): boolean {
  return !block.errors || block.errors.length === 0;
}
