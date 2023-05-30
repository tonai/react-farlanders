import type { IBlock, IBuildingBlock, ILandBlock } from "../types/block";
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
  ANOMALY_SIDS,
  BIO_STOREHOUSE_SID,
  DRYERS,
  GROUND_HYDRATOR_SID,
  GROUND_SID,
  MOUNTAIN_SID,
  PIPES_SID,
  PIPES_SIDS,
  POWER_LINES_SID,
  POWER_LINES_SIDS,
  REINFORCED_PIPES_SID,
  REINFORCED_POWER_LINES_SID,
  SPACEPORTS,
  TUNNEL_SID,
  WATER_DISPENSER_SID,
  WATER_SID,
  blockMap,
} from "../constants/blocks";
import { BlockError, BlockState, Connection } from "../types/block";
import { View } from "../types/game";
import { CellType } from "../types/map";

import { isBuildingBlock, isEnabled } from "./block";
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

export function addBlockToBoard(block: IBuildingBlock, cell: ICell): ICell {
  const type = getCellType(block);
  const newCell = cloneCell(cell);

  if (
    block.connections?.includes(Connection.Tunnel) &&
    !intersect(newCell.tunnel, REINFORCED_POWER_LINES_SID)
  ) {
    newCell.tunnel = TUNNEL_SID;
  }

  if (
    block.connections?.includes(Connection.ReinforcedPowerLine) &&
    !intersect(newCell.power, REINFORCED_POWER_LINES_SID)
  ) {
    newCell.power = REINFORCED_POWER_LINES_SID;
  } else if (
    block.connections?.includes(Connection.PowerLine) &&
    !intersect(newCell.power, POWER_LINES_SIDS)
  ) {
    newCell.power = POWER_LINES_SID;
  }

  if (
    block.connections?.includes(Connection.ReinforcedPipe) &&
    !intersect(newCell.water, REINFORCED_PIPES_SID)
  ) {
    newCell.water = REINFORCED_PIPES_SID;
  } else if (
    block.connections?.includes(Connection.Pipe) &&
    !intersect(newCell.water, PIPES_SIDS)
  ) {
    newCell.water = PIPES_SID;
  }

  if (type === CellType.Buildings) {
    let newSids = [block.sid];
    const sid = newCell.buildings;
    if (sid instanceof Array) {
      newSids = [...sid, ...newSids];
    } else if (sid) {
      newSids = [sid, ...newSids];
    }
    newCell.buildings = newSids.length === 1 ? newSids[0] : newSids;
  } else if (
    type === CellType.Tunnel ||
    type === CellType.Power ||
    type === CellType.Water
  ) {
    newCell[type] = block.sid;
  }

  return newCell;
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
    [depth]: board.map((row, i) =>
      row.map((cell, j) =>
        j === point.x && i === point.y - 1
          ? addBlockToBoard(block, board[i][j])
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
          const sid = getCellBlockSid(cellSids);
          if (sid === 0 && cell.tunnel) {
            return {
              ...cell,
              tunnel: 0,
            };
          }
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

export function transformCell(
  board: IBoardBlock,
  i: number,
  j: number,
  state: BlockState,
  sids?: number[]
): void {
  const landformBlock = getCellBlock(board[i][j].landform);
  const landBlock = getCellBlock(board[i][j].land) as ILandBlock;
  if (landBlock && (!sids || sids.includes(landBlock.sid)) && !landformBlock) {
    landBlock.states ??= [];
    landBlock.states.push(state);
  }
}

export function transformAdjacentCells(
  board: IBoardBlock,
  i: number,
  j: number,
  state: BlockState,
  sids?: number[],
  areaSize = 1,
  maxDistance = 2
): void {
  for (let x = i - areaSize; x <= i + areaSize; x++) {
    for (let y = j - areaSize; y <= j + areaSize; y++) {
      const distance = Math.abs(i - x) + Math.abs(j - y);
      if (
        x >= 0 &&
        y >= 0 &&
        x < board.length &&
        y < board[0].length &&
        distance <= maxDistance
      ) {
        transformCell(board, x, y, state, sids);
      }
    }
  }
}

export function transformBuildingBlock(
  board: IBoardBlock,
  i: number,
  j: number,
  buildingBlock: IBuildingBlock
): void {
  if (isEnabled(buildingBlock)) {
    if (DRYERS.includes(buildingBlock.sid)) {
      transformAdjacentCells(board, i, j, BlockState.Dry);
    }
    if (SPACEPORTS.includes(buildingBlock.sid)) {
      transformAdjacentCells(board, i, j, BlockState.Platform, undefined, 1, 1);
    }
    if (buildingBlock.sid === GROUND_HYDRATOR_SID) {
      transformAdjacentCells(board, i, j, BlockState.Hydrated, [GROUND_SID], 0);
    }
    if (buildingBlock.sid === WATER_DISPENSER_SID) {
      transformAdjacentCells(board, i, j, BlockState.Hydrated, [GROUND_SID]);
    }
    if (buildingBlock.sid === BIO_STOREHOUSE_SID) {
      transformAdjacentCells(board, i, j, BlockState.Bio, [GROUND_SID], 2, 3);
    }
  }
}

export function checkBuildingConditions(
  board: IBoardBlock,
  i: number,
  j: number,
  tunnels: IConnectionBoard,
  power: IConnectionBoard,
  reinforcedPower: IConnectionBoard,
  water: IConnectionBoard,
  reinforcedWater: IConnectionBoard
): void {
  const buildingBlock = getCellBlock(board[i][j].buildings);
  const landBlock = getCellBlock(board[i][j].land);
  if (landBlock && isBuildingBlock(buildingBlock)) {
    buildingBlock.errors ??= [];
    if (
      buildingBlock.connections?.includes(Connection.Tunnel) &&
      !isConnected(tunnels, i, j)
    ) {
      buildingBlock.errors.push(BlockError.MissingTunnel);
    }

    if (
      buildingBlock.connections?.includes(Connection.ReinforcedPowerLine) &&
      !isConnected(reinforcedPower, i, j)
    ) {
      buildingBlock.errors.push(BlockError.MissingReinforcedPowerLine);
    } else if (
      buildingBlock.connections?.includes(Connection.PowerLine) &&
      !isConnected(power, i, j)
    ) {
      buildingBlock.errors.push(BlockError.MissingPowerLine);
    }

    if (
      buildingBlock.connections?.includes(Connection.ReinforcedPipe) &&
      !isConnected(reinforcedWater, i, j)
    ) {
      buildingBlock.errors.push(BlockError.MissingReinforcedPipe);
    } else if (
      buildingBlock.connections?.includes(Connection.Pipe) &&
      !isConnected(water, i, j)
    ) {
      buildingBlock.errors.push(BlockError.MissingPipe);
    }

    if (
      buildingBlock.needSun &&
      j > 0 &&
      getCellBlock(board[i][j - 1].landform)?.sid === MOUNTAIN_SID
    ) {
      buildingBlock.errors.push(BlockError.MissingSun);
    }
  }
}

export function getBlock(sid: number): IBlock | undefined {
  if (sid === 0) {
    return undefined;
  }
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
          ? (cell.buildings.map(getBlock) as IBlock[])
          : cell.buildings
          ? getBlock(cell.buildings)
          : undefined,
      land:
        cell.land instanceof Array
          ? (cell.land.map(getBlock) as IBlock[])
          : getBlock(cell.land),
      landform:
        cell.landform instanceof Array
          ? (cell.landform.map(getBlock) as IBlock[])
          : getBlock(cell.landform),
      tunnel: cell.tunnel ? getBlock(cell.tunnel) : undefined,
    }))
  );

  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      const buildingBlock = getCellBlock(newBoard[i][j].buildings);
      if (buildingBlock?.sid !== 0) {
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

  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      const landformBlockSid = getCellBlock(newBoard[i][j].landform)?.sid ?? 0;
      if (landformBlockSid === WATER_SID) {
        transformAdjacentCells(newBoard, i, j, BlockState.Hydrated, [
          GROUND_SID,
        ]);
      }
      if (ANOMALY_SIDS.includes(landformBlockSid)) {
        transformAdjacentCells(
          newBoard,
          i,
          j,
          BlockState.Anomaly,
          undefined,
          1,
          1
        );
      }
      const { buildings } = newBoard[i][j];
      if (buildings instanceof Array) {
        buildings.forEach((building) =>
          transformBuildingBlock(newBoard, i, j, building as IBuildingBlock)
        );
      } else if (buildings) {
        transformBuildingBlock(newBoard, i, j, buildings as IBuildingBlock);
      }
    }
  }

  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      const buildingBlock = getCellBlock(newBoard[i][j].buildings);
      if (
        buildingBlock &&
        buildingBlock.sid !== 0 &&
        isBuildingBlock(buildingBlock) &&
        !isLandCorrect(buildingBlock, newBoard[i][j])
      ) {
        buildingBlock.errors ??= [];
        buildingBlock.errors.push(BlockError.WrongGround);
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
