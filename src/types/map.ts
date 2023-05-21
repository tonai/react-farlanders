export type IBoard = (number[] | number)[][];

export interface ILevel {
  buildings: IBoard;
  land: IBoard;
  landforms: IBoard;
}

export type IMap = Record<number | string, ILevel>;
