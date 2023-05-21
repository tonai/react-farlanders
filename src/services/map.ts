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
      buildings: map[level].buildings.map((line, j) =>
        line.map((sid, i) =>
          i === point.x && j === point.y - 1 ? block.sid : sid
        )
      ),
      land: map[level].land,
      landforms: map[level].landforms,
    },
  };
}
