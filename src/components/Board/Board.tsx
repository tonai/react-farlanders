import { BLOCK_SIZE } from "../../constants/blocks";
import landBlocks from "../../data/land-blocks.json";
import map from "../../data/map.json";
import { getBackgroundArray } from "../../services/board";
import { IBlock, IBlocks } from "../../types/block";
import { IImage } from "../../types/image";
import { IMap } from "../../types/map";

import './Board.css';

export interface IBoardProps {
  imageMap: Map<IBlock, IImage>;
  level?: number;
}

function Board(props: IBoardProps) {
  const { imageMap, level } = props;
  const mapLevel = (map as IMap)[level];
  const height = mapLevel.land.length;
  const width = mapLevel.land[0].length;
  const blockMap = new Map(
    (landBlocks as IBlocks).map((block) => [block.sid, block])
  );

  const landformBg = getBackgroundArray(blockMap, imageMap, mapLevel.landform);
  const landBg = getBackgroundArray(blockMap, imageMap, mapLevel.land);

  const background = [...landformBg, ...landBg].join(", ");
  const style = {
    height: (height + 1) * BLOCK_SIZE,
    width: width * BLOCK_SIZE,
    background,
  };

  return <div className="Board" style={style}></div>;
}

Board.defaultProps = {
  level: 0,
};

export default Board;
