import type { IImage } from "../../types/image";

import CameraControls from "../CameraControls/CameraControls";
import GameProvider from "../GameProvider/GameProvider";
import Buildings from "../Interfaces/Buildings/Buildings";
import Visualization from "../Interfaces/Visualization/Visualization";

export interface IGameProps {
  imageMap: Map<number, IImage>;
}

function Game(props: IGameProps): JSX.Element {
  return (
    <GameProvider>
      <CameraControls {...props} />
      <Visualization />
      <Buildings />
    </GameProvider>
  );
}

export default Game;
