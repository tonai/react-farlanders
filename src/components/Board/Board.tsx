import type { IBlock, IBlocks } from "../../types/block";
import type { IImage } from "../../types/image";
import type { IMap } from "../../types/map";

import { useRef } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../../constants/blocks";
import landBlocks from "../../data/land-blocks.json";
import map from "../../data/map.json";
import { useBoardCursor } from "../../hooks/useBoardCursor";
import { getBackgroundArray } from "../../services/board";

import "./Board.css";

export interface IBoardProps {
  imageMap: Map<IBlock, IImage>;
  level: number;
}

const blocks = landBlocks as IBlocks;
const blockMap = new Map(blocks.map((block) => [block.sid, block]));

function Board(props: IBoardProps): JSX.Element {
  const { imageMap, level } = props;

  const rootEl = useRef<HTMLDivElement>(null);
  const cursorEl = useRef<HTMLDivElement>(null);
  const selectEl = useRef<HTMLDivElement>(null);

  const boardProps = useBoardCursor(rootEl, cursorEl, selectEl);

  const mapLevel = (map as IMap)[level];
  const height = mapLevel.land.length;
  const width = mapLevel.land[0].length;

  const landformBg = getBackgroundArray(blockMap, imageMap, mapLevel.landform);
  const landBg = getBackgroundArray(blockMap, imageMap, mapLevel.land);

  const background = [...landformBg, ...landBg].join(", ");
  const rootStyle = {
    background,
    height: (height + 1) * BLOCK_SIZE - BLOCK_OFFSET,
    width: width * BLOCK_SIZE,
  };
  const style = {
    height: BLOCK_SIZE,
    width: BLOCK_SIZE,
  };

  return (
    <div ref={rootEl} className="Board" style={rootStyle} {...boardProps}>
      <div ref={cursorEl} className="Board__cursor" style={style} />
      <div ref={selectEl} className="Board__selection" style={style} />
    </div>
  );
}

Board.defaultProps = {
  level: 0,
};

export default Board;
