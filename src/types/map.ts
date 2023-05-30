import type { IBlock } from "./block";

export enum CellType {
  Buildings = "buildings",
  Land = "land",
  Landform = "landform",
  Power = "power",
  Tunnel = "tunnel",
  Water = "water",
}

export enum DrawableCellType {
  Buildings = "buildings",
  Land = "land",
  Landform = "landform",
  Tunnel = "tunnel",
}

export enum NonDrawableCellType {
  Power = "power",
  Water = "water",
}

export type ISid = number[] | number;
export interface ICell {
  buildings?: ISid;
  land: ISid;
  landform: ISid;
  power?: number;
  tunnel?: number;
  water?: number;
}
export type IBoard = ICell[][];
export type IMap = Record<number | string, IBoard>;

export interface ICellBlock
  extends Omit<ICell, "buildings" | "land" | "landform" | "tunnel"> {
  buildings?: IBlock | IBlock[] | undefined;
  land: IBlock | IBlock[] | undefined;
  landform: IBlock | IBlock[] | undefined;
  tunnel?: IBlock;
}
export type IBoardBlock = ICellBlock[][];
export type IMapBlock = Record<number | string, IBoardBlock>;

export type IConnectionBoard = (boolean | null)[][];
