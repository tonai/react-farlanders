import type { Dispatch, SetStateAction } from "react";

export interface IPoint {
  x: number;
  y: number;
}

export interface IGameContext {
  selectedTile?: IPoint;
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>;
}
