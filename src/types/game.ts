import type { BuildingTool, IBuildingBlock } from "./block";
import type { IConnectionBoard, IMap, IMapBlock } from "./map";
import type { Dispatch, SetStateAction } from "react";

export enum View {
  Buildings = "buildings",
  Power = "power",
  Water = "water",
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IGameContext {
  colonyLevel: number;
  map: IMapBlock;
  power: IConnectionBoard;
  selectedBuilding?: IBuildingBlock;
  selectedTile?: IPoint;
  selectedTool?: BuildingTool;
  setMap: Dispatch<SetStateAction<IMap>>;
  setSelectedBuilding: Dispatch<SetStateAction<IBuildingBlock | undefined>>;
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>;
  setSelectedTool: Dispatch<SetStateAction<BuildingTool | undefined>>;
  setView: Dispatch<SetStateAction<View>>;
  tunnels: IConnectionBoard;
  view: View;
  water: IConnectionBoard;
}
