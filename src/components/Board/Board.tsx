import type { IBlock } from "../../types/block";
import type { IImage } from "../../types/image";
import type { CSSProperties } from "react";

import classNames from "classnames";
import { useContext, useRef } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE, blockMap } from "../../constants/blocks";
import { gameContext } from "../../contexts/game";
import { useBoardCursor } from "../../hooks/useBoardCursor";
import { getBackgroundArray } from "../../services/board";
import { BuildingTool } from "../../types/block";

import "./Board.css";

export interface IBoardProps {
  imageMap: Map<IBlock, IImage>;
  level: number;
}

function Board(props: IBoardProps): JSX.Element {
  const { imageMap, level } = props;
  const { map, selectedBuilding, selectedTool } = useContext(gameContext);

  const rootEl = useRef<HTMLDivElement>(null);
  const cursorEl = useRef<HTMLDivElement>(null);
  const selectEl = useRef<HTMLDivElement>(null);

  const boardProps = useBoardCursor(cursorEl, selectEl, imageMap, level);

  const mapLevel = map[level];
  const height = mapLevel.land.length;
  const width = mapLevel.land[0].length;

  const buildingsBg = getBackgroundArray(
    blockMap,
    imageMap,
    mapLevel.buildings
  );
  const landBg = getBackgroundArray(blockMap, imageMap, mapLevel.land);

  const background = [...buildingsBg, ...landBg].join(", ");
  const rootStyle: CSSProperties = {
    background,
    height: (height + 1) * BLOCK_SIZE - BLOCK_OFFSET,
    width: width * BLOCK_SIZE,
  };
  const selectStyle: CSSProperties = {
    height: BLOCK_SIZE,
    width: BLOCK_SIZE,
  };

  return (
    <div ref={rootEl} className="Board" style={rootStyle} {...boardProps}>
      <div
        ref={cursorEl}
        className={classNames("Board__cursor", {
          "Board__cursor--empty": !selectedBuilding,
          "Board__cursor--remove": selectedTool === BuildingTool.Remove,
        })}
      />
      <div ref={selectEl} className="Board__selection" style={selectStyle} />
    </div>
  );
}

Board.defaultProps = {
  level: 0,
};

export default Board;
