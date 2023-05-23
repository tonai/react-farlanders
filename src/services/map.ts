import type { IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type {
  IBlockBoard,
  IBlockMap,
  IBoard,
  IConnectionBoard,
  IMap,
} from "../types/map";

import { TUNNEL_SID, blockMap, landBlockMap } from "../constants/blocks";
import { DRYERS } from "../constants/map";
import { BlockState, Connection } from "../types/block";

import { isBuildingBlock } from "./block";
import { getBase, isConnected, isLandCorrect } from "./board";

export function addBlockToMap(
  map: IMap,
  block: IBuildingBlock,
  point: IPoint,
  level = 0
): IMap {
  return {
    ...map,
    [level]: {
      buildings: map[level].buildings.map((line, j) =>
        line.map((sid, i) => {
          if (i === point.x && j === point.y - 1) {
            const newSids = [block.sid];
            if (
              block.connections?.includes(Connection.Tunnel) &&
              ((sid instanceof Array && !sid.includes(TUNNEL_SID)) ||
                sid !== TUNNEL_SID)
            ) {
              newSids.unshift(TUNNEL_SID);
            }
            if (sid === 0) {
              return newSids;
            }
            return sid instanceof Array
              ? [...sid, ...newSids]
              : [sid, ...newSids];
          }
          return sid;
        })
      ),
      land: map[level].land,
    },
  };
}

export function removeBlockFromMap(map: IMap, point: IPoint, level = 0): IMap {
  return {
    ...map,
    [level]: {
      buildings: map[level].buildings.map((line, j) =>
        line.map((sid, i) => {
          if (i === point.x && j === point.y - 1) {
            return sid instanceof Array ? sid.slice(0, -1) : 0;
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

export function getMapBlock(mapItem?: IBlock | IBlock[]): IBlock | undefined {
  return mapItem instanceof Array ? (mapItem.at(-1) as IBlock) : mapItem;
}

export function transformAdjacentLand(
  land: IBlockBoard,
  buildings: IBlockBoard,
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
  land: IBlockBoard,
  buildings: IBlockBoard,
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

export function getBlockMap(map: IMap, tunnels: IConnectionBoard): IBlockMap {
  const buildings: IBlockBoard = map[0].buildings.map((row) =>
    row.map((cell) =>
      cell instanceof Array ? cell.map(getBlock) : getBlock(cell)
    )
  );
  const land: IBlockBoard = map[0].land.map((row) =>
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
    0: { buildings, land },
  };
}

export function updateConnections(
  map: IBoard,
  connections: IConnectionBoard,
  x: number,
  y: number
): void {
  const mapItem = map[x][y];
  connections[x][y] =
    mapItem instanceof Array
      ? mapItem.includes(TUNNEL_SID)
      : mapItem === TUNNEL_SID;
  if (connections[x][y]) {
    if (x > 1 && connections[x - 1][y] === null) {
      updateConnections(map, connections, x - 1, y);
    }
    if (y > 1 && connections[x][y - 1] === null) {
      updateConnections(map, connections, x, y - 1);
    }
    if (x < map.length - 2 && connections[x + 1][y] === null) {
      updateConnections(map, connections, x + 1, y);
    }
    if (y < map[0].length - 2 && connections[x][y + 1] === null) {
      updateConnections(map, connections, x, y + 1);
    }
  }
}

export function getTunnels(map: IMap): IConnectionBoard {
  const tunnels: IConnectionBoard = map[0].buildings.map((row) =>
    row.map(() => null)
  );
  const base = getBase(map);
  if (base) {
    const { x, y } = base;
    updateConnections(map[0].buildings, tunnels, x, y);
  }
  return tunnels;
}
