import { Dispatch, SetStateAction } from "react";

export interface IPoint {
  x: number;
  y: number;
}

export interface GameContext {
  selectedTile?: IPoint
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>
}
