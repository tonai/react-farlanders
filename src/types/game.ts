import type { BuildingTool, IBuildingBlock } from "./block";
import type { IConnectionBoard, IMap, IMapBlock } from "./map";
import type { IConsumptions, IResources, IStorages } from "./resources";
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
  consumptions: IConsumptions;
  depth: number;
  incomes: IResources;
  map: IMapBlock;
  power: IConnectionBoard;
  resources: IResources;
  selectedBuilding?: IBuildingBlock;
  selectedTile?: IPoint;
  selectedTool?: BuildingTool;
  setMap: Dispatch<SetStateAction<IMap>>;
  setResources: Dispatch<SetStateAction<IResources>>;
  setSelectedBuilding: Dispatch<SetStateAction<IBuildingBlock | undefined>>;
  setSelectedTile: Dispatch<SetStateAction<IPoint | undefined>>;
  setSelectedTool: Dispatch<SetStateAction<BuildingTool | undefined>>;
  setView: Dispatch<SetStateAction<View>>;
  storages: IStorages;
  tunnels: IConnectionBoard;
  view: View;
  water: IConnectionBoard;
}
