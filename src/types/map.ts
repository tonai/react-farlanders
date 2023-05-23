import type { IBlock } from "./block";

export type IBoard = (number[] | number)[][];
export type IConnectionBoard = (boolean | null)[][];

export interface ILevel {
  buildings: IBoard;
  land: IBoard;
}

export type IMap = Record<number | string, ILevel>;

export type IBlockBoard = (IBlock | IBlock[])[][];

export interface IBlockLevel {
  buildings: IBlockBoard;
  land: IBlockBoard;
}

export type IBlockMap = Record<number | string, IBlockLevel>;
