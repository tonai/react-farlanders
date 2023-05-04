export enum Axis {
  X = 'x',
  Y = 'y',
}

export type ICameraDir = 1 | -1;
export type ICameraMoves = Partial<Record<Axis,  1 | -1>>
// export type ICameraMoves = {
//   [T in Axis]?: ICameraDir;
// };
