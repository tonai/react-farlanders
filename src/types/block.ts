export enum GroundType {
  Ground = "ground",
  Underground = "underground",
}

export enum BuildingTool {
  Remove = "remove",
}

export enum BlockState {
  WrongGround = "wrong-ground",
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
}

export interface IBuildingBlock extends IBlock {
  category: string;
  conditions: IBuildingCondition;
  only?: GroundType;
  states?: BlockState[];
  title: string;
}

export type IBlockCategories = IBlockCategory[];
export type IBlocks = IBlock[];
export type IBuildingBlocks = IBuildingBlock[];
export type IBlockMap = Map<IBlock["sid"], IBlock>;
