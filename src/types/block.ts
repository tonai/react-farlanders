import type { IConsumptions, ICosts, IResources, IStorages } from "./resources";

export enum GroundType {
  Ground = "ground",
  Underground = "underground",
}

export enum BuildingTool {
  Remove = "remove",
}

export enum BlockState {
  Anomaly = "anomaly",
  Bio = "bio",
  Dry = "dry",
  Hydrated = "hydrated",
  Platform = "platform",
}

export enum BlockError {
  WrongGround = "wrong-ground",
  MissingPipe = "missing-pipe",
  MissingPowerLine = "missing-power-line",
  MissingReinforcedPowerLine = "missing-reinforced-power-line",
  MissingReinforcedPipe = "missing-reinforced-pipe",
  MissingSun = "missing-sun",
  MissingTunnel = "missing-tunnel",
}

export enum Connection {
  Pipe = "pipe",
  PowerLine = "power-line",
  ReinforcedPowerLine = "reinforced-power-line",
  ReinforcedPipe = "reinforced-pipe",
  Tunnel = "tunnel",
}

export interface IBlockCategory {
  id: string;
  images: string;
  title: string;
}
export interface IBlock {
  id: string;
  images: string;
  sid: number;
  variants?: Record<string, string>;
}

export interface IBuildingCondition {
  buildings?: number[];
  land?: number[];
  landform?: number[];
  state: BlockState;
}

export interface IBuildingBlock extends IBlock {
  category: string;
  conditions: IBuildingCondition;
  connections?: Connection[];
  consumption: Partial<IConsumptions>;
  cost: Partial<ICosts>;
  errors?: BlockError[];
  income?: Partial<IResources>;
  needSun?: boolean;
  only?: GroundType;
  resources?: Partial<IResources>;
  storage?: Partial<IStorages>;
  title: string;
}

export interface ILandBlock extends IBlock {
  states?: BlockState[];
}

export type IBlockCategories = IBlockCategory[];
export type IBlocks = IBlock[];
export type IBuildingBlocks = IBuildingBlock[];
export type IBlockMap = Map<IBlock["sid"], IBlock>;
