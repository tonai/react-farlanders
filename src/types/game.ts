import type { BuildingTool, IBuildingBlock } from "./block";
import type { IMap } from "./map";
import type { Dispatch, SetStateAction } from "react";

export interface IPoint {
  x: number;
  y: number;
}

export interface IGameContext {
  map: IMap;
  selectedBuilding?: IBuildingBlock;
  selectedTile?: IPoint;
  selectedTool?: BuildingTool;
  setMap: Dispatch<SetStateAction<IMap>>;
  setSelectedBuilding: Dispatch<SetStateAction<IBuildingBlock | undefined>>;
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>;
  setSelectedTool: Dispatch<SetStateAction<BuildingTool | undefined>>;
}
