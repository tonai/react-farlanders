import { IBlock } from "../../types/block";
import { IImage } from "../../types/image";
import Board from "../Board/Board";

interface IProps {
  imageMap: Map<IBlock, IImage>;
}

function Game(props: IProps) {
  return <Board {...props} />;
}

export default Game;
