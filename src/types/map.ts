export interface ILevel {
  land: number[][];
  landform: number[][];
}

export type IMap = Record<string | number, ILevel>;
