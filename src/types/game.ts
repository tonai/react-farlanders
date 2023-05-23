import type { BuildingTool, IBuildingBlock } from "./block";
import type { IBlockMap, IMap } from "./map";
import type { Dispatch, SetStateAction } from "react";

export interface IPoint {
  x: number;
  y: number;
}

export interface IGameContext {
  colonyLevel: number;
  map: IBlockMap;
  selectedBuilding?: IBuildingBlock;
  selectedTile?: IPoint;
  selectedTool?: BuildingTool;
  setMap: Dispatch<SetStateAction<IMap>>;
  setSelectedBuilding: Dispatch<SetStateAction<IBuildingBlock | undefined>>;
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>;
  setSelectedTool: Dispatch<SetStateAction<BuildingTool | undefined>>;
}
