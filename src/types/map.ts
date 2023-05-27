import type { IBlock } from "./block";

export type ISid = number[] | number;
export type IBoard = ISid[][];
export type IConnectionBoard = (boolean | null)[][];

export interface ILevel {
  buildings: IBoard;
  land: IBoard;
  power: IBoard;
  water: IBoard;
}

export type IMap = Record<number | string, ILevel>;

export type IBoardBlock = (IBlock | IBlock[])[][];

export interface ILevelBlock extends Omit<ILevel, "buildings" | "land"> {
  buildings: IBoardBlock;
  land: IBoardBlock;
}

export type IMapBlock = Record<number | string, ILevelBlock>;
