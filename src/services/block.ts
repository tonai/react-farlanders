import type { IBlock, IBuildingBlock, ILandBlock } from "../types/block";

import { BlockState } from "../types/block";

export function isBuildingBlock(block?: IBlock): block is IBuildingBlock {
  if (!block) {
    return false;
  }
  return "category" in block;
}

export function hasState(block: IBlock, state: BlockState): boolean {
  if (((block as ILandBlock)?.states?.length ?? 0) > 0) {
    const states = (block as ILandBlock).states as BlockState[];
    if (state === BlockState.Hydrated) {
      return (
        states.includes(BlockState.Hydrated) && !states.includes(BlockState.Dry)
      );
    }
    return states.includes(state);
  }
  return false;
}

export function isEnabled(block: IBuildingBlock): boolean {
  return !block.errors || block.errors.length === 0;
}

export function isBlocks(
  blocks?: IBlock | IBlock[] | number
): blocks is IBlock | IBlock[] {
  return typeof blocks !== "number" && typeof blocks !== "undefined";
}

export function isSid(blocks?: IBlock | IBlock[] | number): blocks is number {
  return typeof blocks === "number";
}
