export enum GroundType {
  Ground = "ground",
  Underground = "underground",
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

export interface IBuildingBlock extends IBlock {
  category: string;
  only?: GroundType;
  title: string;
}

export type IBlockCategories = IBlockCategory[];
export type IBlocks = IBlock[];
export type IBuildingBlocks = IBuildingBlock[];
export type IBlockMap = Map<IBlock["sid"], IBlock>;
