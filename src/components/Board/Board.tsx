import { useRef } from "react";
import { BLOCK_OFFSET, BLOCK_SIZE } from "../../constants/blocks";
import landBlocks from "../../data/land-blocks.json";
import map from "../../data/map.json";
import { getBackgroundArray } from "../../services/board";
import { IBlock, IBlocks } from "../../types/block";
import { IImage } from "../../types/image";
import { IMap } from "../../types/map";

import "./Board.css";
import { useBoardCursor } from "../../hooks/useBoardCursor";

export interface IBoardProps {
  imageMap: Map<IBlock, IImage>;
  level: number;
}

function Board(props: IBoardProps) {
  const { imageMap, level } = props;

  const rootEl = useRef<HTMLDivElement>(null);
  const cursorEl = useRef<HTMLDivElement>(null);
  const selectEl = useRef<HTMLDivElement>(null);

  const boardProps = useBoardCursor(rootEl, cursorEl, selectEl);

  const mapLevel = (map as IMap)[level];
  const height = mapLevel.land.length;
  const width = mapLevel.land[0].length;
  const blockMap = new Map(
    (landBlocks as IBlocks).map((block) => [block.sid, block])
  );

  const landformBg = getBackgroundArray(blockMap, imageMap, mapLevel.landform);
  const landBg = getBackgroundArray(blockMap, imageMap, mapLevel.land);

  const background = [...landformBg, ...landBg].join(", ");
  const rootStyle = {
    height: (height + 1) * BLOCK_SIZE - BLOCK_OFFSET,
    width: width * BLOCK_SIZE,
    background,
  };
  const style = {
    height: BLOCK_SIZE,
    width: BLOCK_SIZE,
  }

  return (
    <div className="Board" ref={rootEl} style={rootStyle} {...boardProps}>
      <div className="Board__cursor" ref={cursorEl} style={style} />
      <div className="Board__selection" ref={selectEl} style={style} />
    </div>
  );
}

Board.defaultProps = {
  level: 0,
};

export default Board;
