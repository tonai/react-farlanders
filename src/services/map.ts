import type { IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type {
  IBoard,
  IBoardBlock,
  IConnectionBoard,
  ILevel,
  IMap,
  IMapBlock,
  ISid,
} from "../types/map";

import {
  PIPES_SID,
  PIPES_SIDS,
  POWER_LINES_SID,
  POWER_LINES_SIDS,
  REINFORCED_PIPES_SID,
  REINFORCED_POWER_LINES_SID,
  TUNNEL_SID,
  blockMap,
  landBlockMap,
} from "../constants/blocks";
import { DRYERS } from "../constants/map";
import { BlockState, Connection } from "../types/block";
import { View } from "../types/game";

import { isBuildingBlock } from "./block";
import { isLandCorrect } from "./board";
import { isConnected } from "./connections";
import { intersect } from "./utils";

export function getNewSid(
  block: IBuildingBlock,
  level: ILevel,
  x: number,
  y: number
): ISid {
  let newSids = [block.sid];
  const sid = level.buildings[x][y];
  if (
    block.connections?.includes(Connection.Tunnel) &&
    ((sid instanceof Array && !sid.includes(TUNNEL_SID)) || sid !== TUNNEL_SID)
  ) {
    newSids.unshift(TUNNEL_SID);
  }
  if (
    block.connections?.includes(Connection.ReinforcedPowerLine) &&
    !intersect(level.power[x][y], REINFORCED_POWER_LINES_SID)
  ) {
    level.power[x][y] = REINFORCED_POWER_LINES_SID;
  } else if (
    block.connections?.includes(Connection.PowerLine) &&
    !intersect(level.power[x][y], POWER_LINES_SIDS)
  ) {
    level.power[x][y] = POWER_LINES_SID;
  }
  if (
    block.connections?.includes(Connection.ReinforcedPipe) &&
    !intersect(level.water[x][y], REINFORCED_PIPES_SID)
  ) {
    level.water[x][y] = REINFORCED_PIPES_SID;
  } else if (
    block.connections?.includes(Connection.Pipe) &&
    !intersect(level.water[x][y], PIPES_SIDS)
  ) {
    level.water[x][y] = PIPES_SID;
  }
  if (sid instanceof Array) {
    newSids = [...sid, ...newSids];
  } else if (sid !== 0) {
    newSids = [sid, ...newSids];
  }
  return newSids.length === 1 ? newSids[0] : newSids;
}

export function getBoardKey(block: IBuildingBlock): keyof ILevel {
  if (POWER_LINES_SIDS.includes(block.sid)) {
    return "power";
  }
  if (PIPES_SIDS.includes(block.sid)) {
    return "water";
  }
  return "buildings";
}

export function cloneBoard(board: IBoard): IBoard {
  return board.map((row) =>
    row.map((cell) => (cell instanceof Array ? [...cell] : cell))
  );
}

export function cloneLevel(level: ILevel): ILevel {
  return {
    buildings: cloneBoard(level.buildings),
    land: cloneBoard(level.land),
    power: cloneBoard(level.power),
    water: cloneBoard(level.water),
  };
}

export function addBlockToMap(
  map: IMap,
  block: IBuildingBlock,
  point: IPoint,
  levelDepth = 0
): IMap {
  const boardKey = getBoardKey(block);
  const level = cloneLevel(map[levelDepth]);
  level[boardKey] = level[boardKey].map((line, j) =>
    line.map((sid, i) =>
      i === point.x && j === point.y - 1 ? getNewSid(block, level, j, i) : sid
    )
  );
  return {
    ...map,
    [levelDepth]: level,
  };
}

export function removeBlockFromMap(
  map: IMap,
  point: IPoint,
  view: View = View.Buildings,
  level = 0
): IMap {
  const board = map[level][view];
  return {
    ...map,
    [level]: {
      ...map[level],
      [view]: board.map((line, j) =>
        line.map((sid, i) => {
          if (i === point.x && j === point.y - 1) {
            return sid instanceof Array ? sid.slice(0, -1) : 0;
          }
          return sid;
        })
      ),
    },
  };
}

export function getMapBlockSid(mapItem?: ISid): number | undefined {
  return mapItem instanceof Array ? (mapItem.at(-1) as number) : mapItem;
}

export function getMapBlock(mapItem?: IBlock | IBlock[]): IBlock | undefined {
  return mapItem instanceof Array ? (mapItem.at(-1) as IBlock) : mapItem;
}

export function transformAdjacentLand(
  land: IBoardBlock,
  buildings: IBoardBlock,
  x: number,
  y: number,
  from: number[],
  to: number,
  push = false
): void {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      const building = getMapBlock(buildings?.[i]?.[j]);
      const landBlock = getMapBlock(land?.[i]?.[j]);
      const toBlock = blockMap.get(to);
      if (
        toBlock &&
        landBlock &&
        from.includes(landBlock.sid) &&
        (!building || !landBlockMap.has(building.sid))
      ) {
        const cell = land[i][j];
        if (push) {
          if (cell instanceof Array) {
            cell.push(toBlock);
          } else {
            land[i][j] = [landBlock, toBlock];
          }
        } else {
          land[i][j] = toBlock;
        }
      }
    }
  }
}

export function checkBuildingConditions(
  land: IBoardBlock,
  buildings: IBoardBlock,
  tunnels: IConnectionBoard,
  x: number,
  y: number
): void {
  const buildingBlock = getMapBlock(buildings?.[x]?.[y]);
  const landBlock = getMapBlock(land[x][y]);
  if (buildingBlock && landBlock && isBuildingBlock(buildingBlock)) {
    buildingBlock.states ??= [];
    if (!isLandCorrect(buildingBlock, landBlock.sid)) {
      buildingBlock.states.push(BlockState.WrongGround);
    }
    if (!isConnected(tunnels, x, y)) {
      buildingBlock.states.push(BlockState.MissingTunnel);
    }
  }
}

export function getBlock(sid: number): IBlock {
  const block = blockMap.get(sid) as IBlock;
  return { ...block };
}

export function getBlockMap(map: IMap, tunnels: IConnectionBoard): IMapBlock {
  const buildings: IBoardBlock = map[0].buildings.map((row) =>
    row.map((cell) =>
      cell instanceof Array ? cell.map(getBlock) : getBlock(cell)
    )
  );
  const land: IBoardBlock = map[0].land.map((row) =>
    row.map((cell) =>
      cell instanceof Array ? cell.map(getBlock) : getBlock(cell)
    )
  );

  for (let i = 0; i < map[0].land.length; i++) {
    for (let j = 0; j < map[0].land[i].length; j++) {
      const building = getMapBlock(buildings[i][j]);
      if (building && DRYERS.includes(building.sid)) {
        transformAdjacentLand(land, buildings, i, j, [2, 4], 5);
      }
      if (building?.sid === 20) {
        transformAdjacentLand(land, buildings, i, j, [2], 4, true);
      }
      if (building?.sid !== 0) {
        checkBuildingConditions(land, buildings, tunnels, i, j);
      }
    }
  }

  return {
    ...map,
    0: { ...map[0], buildings, land },
  };
}
