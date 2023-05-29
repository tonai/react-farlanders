import type { IBlock, IBuildingBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type {
  IBoard,
  IBoardBlock,
  ICell,
  IConnectionBoard,
  IMap,
  IMapBlock,
  ISid,
} from "../types/map";

import {
  MOUNTAIN_SID,
  PIPES_SID,
  PIPES_SIDS,
  POWER_LINES_SID,
  POWER_LINES_SIDS,
  REINFORCED_PIPES_SID,
  REINFORCED_POWER_LINES_SID,
  TUNNEL_SID,
  WATER_SID,
  blockMap,
  landBlockMap,
} from "../constants/blocks";
import { DRYERS } from "../constants/map";
import { BlockState, Connection } from "../types/block";
import { View } from "../types/game";
import { CellType } from "../types/map";

import { isBuildingBlock } from "./block";
import { isLandCorrect } from "./board";
import { isConnected } from "./connections";
import { intersect } from "./utils";

export function getCellBlockSid(mapItem?: ISid): number | undefined {
  return mapItem instanceof Array ? (mapItem.at(-1) as number) : mapItem;
}

export function getCellBlock(mapItem?: IBlock | IBlock[]): IBlock | undefined {
  return mapItem instanceof Array ? (mapItem.at(-1) as IBlock) : mapItem;
}

export function getCellType(block: IBuildingBlock): CellType {
  if (TUNNEL_SID === block.sid) {
    return CellType.Tunnel;
  }
  if (POWER_LINES_SIDS.includes(block.sid)) {
    return CellType.Power;
  }
  if (PIPES_SIDS.includes(block.sid)) {
    return CellType.Water;
  }
  return CellType.Buildings;
}

export function cloneCell(cell: ICell): ICell {
  return {
    ...cell,
    buildings:
      cell.buildings instanceof Array ? [...cell.buildings] : cell.buildings,
    land: cell.land instanceof Array ? [...cell.land] : cell.land,
    landform:
      cell.landform instanceof Array ? [...cell.landform] : cell.landform,
  };
}

export function addBlockToBoard(
  block: IBuildingBlock,
  board: IBoard,
  x: number,
  y: number
): ICell {
  const type = getCellType(block);
  const cell = cloneCell(board[x][y]);

  if (
    block.connections?.includes(Connection.Tunnel) &&
    !intersect(cell.tunnel, REINFORCED_POWER_LINES_SID)
  ) {
    cell.tunnel = TUNNEL_SID;
  }

  if (
    block.connections?.includes(Connection.ReinforcedPowerLine) &&
    !intersect(cell.power, REINFORCED_POWER_LINES_SID)
  ) {
    cell.power = REINFORCED_POWER_LINES_SID;
  } else if (
    block.connections?.includes(Connection.PowerLine) &&
    !intersect(cell.power, POWER_LINES_SIDS)
  ) {
    cell.power = POWER_LINES_SID;
  }

  if (
    block.connections?.includes(Connection.ReinforcedPipe) &&
    !intersect(cell.water, REINFORCED_PIPES_SID)
  ) {
    cell.water = REINFORCED_PIPES_SID;
  } else if (
    block.connections?.includes(Connection.Pipe) &&
    !intersect(cell.water, PIPES_SIDS)
  ) {
    cell.water = PIPES_SID;
  }

  if (type === CellType.Buildings) {
    let newSids = [block.sid];
    const sid = cell.buildings;
    if (sid instanceof Array) {
      newSids = [...sid, ...newSids];
    } else if (sid) {
      newSids = [sid, ...newSids];
    }
    cell.buildings = newSids.length === 1 ? newSids[0] : newSids;
  } else if (
    type === CellType.Tunnel ||
    type === CellType.Power ||
    type === CellType.Water
  ) {
    cell[type] = block.sid;
  }

  return cell;
}

export function addBlockToMap(
  map: IMap,
  block: IBuildingBlock,
  point: IPoint,
  depth = 0
): IMap {
  const board = map[depth];
  return {
    ...map,
    [depth]: board.map((row, j) =>
      row.map((cell, i) =>
        i === point.x && j === point.y - 1
          ? addBlockToBoard(block, board, j, i)
          : cell
      )
    ),
  };
}

export function removeBlockFromMap(
  map: IMap,
  point: IPoint,
  view: View = View.Buildings,
  depth = 0
): IMap {
  const board = map[depth];
  return {
    ...map,
    [depth]: board.map((row, j) =>
      row.map((cell, i) => {
        if (i === point.x && j === point.y - 1) {
          const cellSids = cell[view];
          return {
            ...cell,
            [view]: cellSids instanceof Array ? cellSids.slice(0, -1) : 0,
          };
        }
        return cell;
      })
    ),
  };
}

export function transformAdjacentLand(
  board: IBoardBlock,
  x: number,
  y: number,
  from: number[],
  to: number,
  push = false
): void {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      const buildingBlock = getCellBlock(board[x][y].buildings);
      const landBlock = getCellBlock(board[x][y].land);
      const toBlock = blockMap.get(to);
      if (
        toBlock &&
        landBlock &&
        from.includes(landBlock.sid) &&
        (!buildingBlock || !landBlockMap.has(buildingBlock.sid))
      ) {
        const cell = board[x][y].land;
        if (push) {
          if (cell instanceof Array) {
            cell.push(toBlock);
          } else {
            board[x][y].land = [landBlock, toBlock];
          }
        } else {
          board[x][y].land = toBlock;
        }
      }
    }
  }
}

export function checkBuildingConditions(
  board: IBoardBlock,
  x: number,
  y: number,
  tunnels: IConnectionBoard,
  power: IConnectionBoard,
  reinforcedPower: IConnectionBoard,
  water: IConnectionBoard,
  reinforcedWater: IConnectionBoard
): void {
  const buildingBlock = getCellBlock(board[x][y].buildings);
  const landBlock = getCellBlock(board[x][y].land);
  if (buildingBlock && landBlock && isBuildingBlock(buildingBlock)) {
    buildingBlock.states ??= [];
    if (!isLandCorrect(buildingBlock, landBlock.sid)) {
      buildingBlock.states.push(BlockState.WrongGround);
    }

    if (
      buildingBlock.connections?.includes(Connection.Tunnel) &&
      !isConnected(tunnels, x, y)
    ) {
      buildingBlock.states.push(BlockState.MissingTunnel);
    }

    if (
      buildingBlock.connections?.includes(Connection.ReinforcedPowerLine) &&
      !isConnected(reinforcedPower, x, y)
    ) {
      buildingBlock.states.push(BlockState.MissingReinforcedPowerLine);
    } else if (
      buildingBlock.connections?.includes(Connection.PowerLine) &&
      !isConnected(power, x, y)
    ) {
      buildingBlock.states.push(BlockState.MissingPowerLine);
    }

    if (
      buildingBlock.connections?.includes(Connection.ReinforcedPipe) &&
      !isConnected(reinforcedWater, x, y)
    ) {
      buildingBlock.states.push(BlockState.MissingReinforcedPipe);
    } else if (
      buildingBlock.connections?.includes(Connection.Pipe) &&
      !isConnected(water, x, y)
    ) {
      buildingBlock.states.push(BlockState.MissingPipe);
    }

    if (
      buildingBlock.needSun &&
      y > 0 &&
      getCellBlock(board[x][y - 1].buildings)?.sid === MOUNTAIN_SID
    ) {
      buildingBlock.states.push(BlockState.MissingSun);
    }
  }
}

export function getBlock(sid: number): IBlock {
  const block = blockMap.get(sid) as IBlock;
  return { ...block };
}

export function getBoardBlock(
  board: IBoard,
  tunnels: IConnectionBoard,
  power: IConnectionBoard,
  reinforcedPower: IConnectionBoard,
  water: IConnectionBoard,
  reinforcedWater: IConnectionBoard
): IBoardBlock {
  const newBoard: IBoardBlock = board.map((row) =>
    row.map((cell) => ({
      ...cell,
      buildings:
        cell.buildings instanceof Array
          ? cell.buildings.map(getBlock)
          : cell.buildings
          ? getBlock(cell.buildings)
          : undefined,
      land:
        cell.land instanceof Array
          ? cell.land.map(getBlock)
          : getBlock(cell.land),
      landform:
        cell.landform instanceof Array
          ? cell.landform.map(getBlock)
          : getBlock(cell.landform),
      tunnel: cell.tunnel ? getBlock(cell.tunnel) : undefined,
    }))
  );

  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      const building = getCellBlock(newBoard[i][j].buildings);
      if (building && DRYERS.includes(building.sid)) {
        transformAdjacentLand(newBoard, i, j, [2, 4], 5);
      }
      if (building?.sid === WATER_SID) {
        transformAdjacentLand(newBoard, i, j, [2], 4, true);
      }
    }
  }

  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      const building = getCellBlock(newBoard[i][j].buildings);
      if (building?.sid !== 0) {
        checkBuildingConditions(
          newBoard,
          i,
          j,
          tunnels,
          power,
          reinforcedPower,
          water,
          reinforcedWater
        );
      }
    }
  }

  return newBoard;
}

export function getMapBlock(
  map: IMap,
  tunnels: IConnectionBoard,
  power: IConnectionBoard,
  reinforcedPower: IConnectionBoard,
  water: IConnectionBoard,
  reinforcedWater: IConnectionBoard
): IMapBlock {
  return Object.fromEntries(
    Object.entries(map).map(([depth, board]) => [
      depth,
      getBoardBlock(
        board,
        tunnels,
        power,
        reinforcedPower,
        water,
        reinforcedWater
      ),
    ])
  );
}
