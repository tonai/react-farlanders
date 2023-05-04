import { IBlock } from "../../types/block";
import { IImage } from "../../types/image";

import CameraControls from "../CameraControls/CameraControls";

export interface IGameProps {
  imageMap: Map<IBlock, IImage>;
}

function Game(props: IGameProps) {
  return <CameraControls {...props} />;
}

export default Game;
