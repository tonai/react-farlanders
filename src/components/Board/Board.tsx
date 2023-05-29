import type { IImage } from "../../types/image";
import type { CSSProperties } from "react";

import classNames from "classnames";
import { useContext, useRef } from "react";

import { BLOCK_SIZE } from "../../constants/blocks";
import { gameContext } from "../../contexts/game";
import { useBoardCursor } from "../../hooks/useBoardCursor";
import { getBackgroundArray } from "../../services/board";
import { BuildingTool } from "../../types/block";
import { View } from "../../types/game";
import { DrawableCellType } from "../../types/map";
import Connections from "../Connections/Connections";

import "./Board.css";

export interface IBoardProps {
  imageMap: Map<number, IImage>;
}

function Board(props: IBoardProps): JSX.Element {
  const { imageMap } = props;
  const { depth, map, selectedBuilding, selectedTool, view } =
    useContext(gameContext);

  const rootEl = useRef<HTMLDivElement>(null);
  const cursorEl = useRef<HTMLDivElement>(null);
  const selectEl = useRef<HTMLDivElement>(null);
  const stateEl = useRef<HTMLDivElement>(null);

  const boardProps = useBoardCursor(
    cursorEl,
    selectEl,
    stateEl,
    imageMap,
    depth
  );

  const mapLevel = map[depth];
  const rows = mapLevel.length;
  const cols = mapLevel[0].length;

  const buildingsBg = getBackgroundArray(imageMap, mapLevel, [
    DrawableCellType.Buildings,
    DrawableCellType.Tunnel,
    DrawableCellType.Landform,
  ]);
  const landBg = getBackgroundArray(imageMap, mapLevel);

  const background = [...buildingsBg, ...landBg].join(",");
  const height = (rows + 1) * BLOCK_SIZE;
  const width = cols * BLOCK_SIZE;
  const rootStyle: CSSProperties = {
    background,
    height,
    width,
  };
  const selectStyle: CSSProperties = {
    height: BLOCK_SIZE,
    width: BLOCK_SIZE,
  };

  return (
    <div className="Board">
      <div
        ref={rootEl}
        className={classNames("Board__bg", {
          "Board__bg--fade": view !== View.Buildings,
        })}
        style={rootStyle}
        {...boardProps}
      />
      {view !== View.Buildings && <Connections height={height} width={width} />}
      <div
        ref={cursorEl}
        className={classNames("Board__cursor", {
          "Board__cursor--empty": !selectedBuilding,
          "Board__cursor--remove": selectedTool === BuildingTool.Remove,
        })}
      />
      <div ref={selectEl} className="Board__selection" style={selectStyle} />
      <div ref={stateEl} className="Board__state" />
    </div>
  );
}

Board.defaultProps = {
  level: 0,
};

export default Board;
