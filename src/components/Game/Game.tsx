import type { IImage } from "../../types/image";

import CameraControls from "../CameraControls/CameraControls";
import GameProvider from "../GameProvider/GameProvider";
import Buildings from "../Interfaces/Buildings/Buildings";
import Resources from "../Interfaces/Resources/Resources";
import Visualization from "../Interfaces/Visualization/Visualization";

export interface IGameProps {
  imageMap: Map<number, IImage>;
}

function Game(props: IGameProps): JSX.Element {
  return (
    <GameProvider>
      <CameraControls {...props} />
      <Resources />
      <Visualization />
      <Buildings />
    </GameProvider>
  );
}

export default Game;
