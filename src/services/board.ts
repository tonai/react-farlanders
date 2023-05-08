import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";
import { IBlock, IBlockMap } from "../types/block";
import { IImage } from "../types/image";

function getBackground(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  map: number[][],
  x: number,
  y: number
) {
  const sid = map[y][x];
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
  return `${x * BLOCK_SIZE}px ${(y + 2) * BLOCK_SIZE - BLOCK_OFFSET - image.height}px no-repeat url(${
    block.images
  })`;
}

export function getBackgroundArray(
  blockMap: IBlockMap,
  imageMap: Map<IBlock, IImage>,
  board: number[][]
) {
  const land = [...board];
  return land
    .map((line: number[], j: number) =>
      line.map((_, i) =>
        getBackground(blockMap, imageMap, board, i, land.length - j - 1)
      )
    )
    .flat()
    .filter((x) => x);
}
