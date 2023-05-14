import type { IBuildingBlock } from "./block";
import type { Dispatch, SetStateAction } from "react";

export interface IPoint {
  x: number;
  y: number;
}

export interface IGameContext {
  selectedBuilding?: IBuildingBlock;
  selectedTile?: IPoint;
  setSelectedBuilding: Dispatch<SetStateAction<IBuildingBlock | undefined>>;
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>;
}
