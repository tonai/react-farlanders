import type { IBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IBoard, ILevel, IMap } from "../types/map";

import { DRYERS } from "../constants/map";

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
        line.map((sid, i) => {
          if (i === point.x && j === point.y - 1) {
            if (sid === 0) {
              return block.sid;
            }
            return sid instanceof Array
              ? [...sid, block.sid]
              : [sid, block.sid];
          }
          return sid;
        })
      ),
      land: map[level].land,
    },
  };
}

export function getMapBlockSid(
  mapItem?: number[] | number
): number | undefined {
  return mapItem instanceof Array ? (mapItem.at(-1) as number) : mapItem;
}

export function transformAdjacentLand(
  level: ILevel,
  board: IBoard,
  x: number,
  y: number,
  from: number[],
  to: number,
  push = false
): void {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      const building = getMapBlockSid(level.buildings?.[i]?.[j]);
      const land = getMapBlockSid(board?.[i]?.[j]);
      if (land && from.includes(land) && building === 0) {
        const cell = board[i][j];
        if (push) {
          if (cell instanceof Array) {
            cell.push(to);
          } else {
            board[i][j] = [land, to];
          }
        } else {
          board[i][j] = to;
        }
      }
    }
  }
}

export function getUpdatedMap(map: IMap): IMap {
  const land: IBoard = map[0].land.map((row) =>
    row.map((cell) => (cell instanceof Array ? [...cell] : cell))
  );

  for (let i = 0; i < map[0].land.length; i++) {
    for (let j = 0; j < map[0].land[i].length; j++) {
      const building = getMapBlockSid(map[0].buildings[i][j]);
      if (building && DRYERS.includes(building)) {
        transformAdjacentLand(map[0], land, i, j, [2, 4], 5);
      }
      if (building === 20) {
        transformAdjacentLand(map[0], land, i, j, [2], 4, true);
      }
    }
  }

  return {
    ...map,
    0: { ...map[0], land },
  };
}
