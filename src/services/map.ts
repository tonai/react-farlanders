import type { IBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IMap } from "../types/map";

export function addBlockToMap(
  map: IMap,
  block: IBlock,
  point: IPoint,
  level = 0
): IMap {
  return {
    ...map,
    [level]: {
      land: map[level].land,
      landform: map[level].landform.map((line: number[], j: number) =>
        line.map((sid, i) =>
          i === point.x && j === point.y - 1 ? block.sid : sid
        )
      ),
    },
  };
}
