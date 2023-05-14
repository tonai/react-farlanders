import type { IBlock } from "../../types/block";
import type { IImage } from "../../types/image";

import CameraControls from "../CameraControls/CameraControls";
import GameProvider from "../GameProvider/GameProvider";

export interface IGameProps {
  imageMap: Map<IBlock, IImage>;
}

function Game(props: IGameProps): JSX.Element {
  return (
    <GameProvider>
      <CameraControls {...props} />
    </GameProvider>
  );
}

export default Game;
