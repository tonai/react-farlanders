export interface ILevel {
  buildings: (number[] | number)[][];
  land: number[][];
  landforms: number[][];
}

export type IMap = Record<number | string, ILevel>;
