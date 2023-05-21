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
        line.map((sid, i) =>
          i === point.x && j === point.y - 1 ? block.sid : sid
        )
      ),
      land: map[level].land,
      landforms: map[level].landforms,
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
  x: number,
  y: number,
  from: number[],
  to: number,
  push = false
): void {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      const landform = getMapBlockSid(level.landforms?.[i]?.[j]);
      const land = getMapBlockSid(level.land?.[i]?.[j]);
      if (land && from.includes(land) && landform === 0) {
        const cell = level.land[i][j];
        if (push) {
          if (cell instanceof Array) {
            cell.push(to);
          } else {
            level.land[i][j] = [land, to];
          }
        } else {
          level.land[i][j] = to;
        }
      }
    }
  }
}

export function getUpdatedMap(map: IMap): IMap {
  const land: IBoard = [];
  for (let i = 0; i < map[0].land.length; i++) {
    land[i] = [];
    for (let j = 0; j < map[0].land[i].length; j++) {
      const cell = map[0].land[i][j];
      const landform = map[0].landforms[i][j];
      const building = getMapBlockSid(map[0].buildings[i][j]);
      if (building && DRYERS.includes(building)) {
        transformAdjacentLand(map[0], i, j, [2, 4], 5);
      }
      if (landform === 20 && building === 0) {
        transformAdjacentLand(map[0], i, j, [2], 4, true);
      }
      land[i][j] = cell;
    }
  }

  return {
    ...map,
    0: { ...map[0], land },
  };
}
