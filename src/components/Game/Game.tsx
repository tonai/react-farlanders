import type { IImage } from "../../types/image";

import CameraControls from "../CameraControls/CameraControls";
import GameProvider from "../GameProvider/GameProvider";
import BuildingsInterface from "../Interfaces/BuildingsInterface/BuildingsInterface";
import VisualizationInterface from "../Interfaces/VisualizationInterface/VisualizationInterface";

export interface IGameProps {
  imageMap: Map<number, IImage>;
}

function Game(props: IGameProps): JSX.Element {
  return (
    <GameProvider>
      <CameraControls {...props} />
      <VisualizationInterface />
      <BuildingsInterface />
    </GameProvider>
  );
}

export default Game;
