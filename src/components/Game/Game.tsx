import { IBlock } from "../../types/block";
import { IImage } from "../../types/image";

import CameraControls from "../CameraControls/CameraControls";
import GameProvider from "../GameProvider/GameProvider";

export interface IGameProps {
  imageMap: Map<IBlock, IImage>;
}

function Game(props: IGameProps) {
  return (
    <GameProvider>
      <CameraControls {...props} />
    </GameProvider>
  );
}

export default Game;
