import type { IBuildingBlock } from "../types/block";
import type { ICellBlock, IMapBlock } from "../types/map";
import type {
  Consumption,
  IConsumptions,
  ICosts,
  IResources,
  IStorages,
  Resource,
  Storage,
} from "../types/resources";

import {
  PIPES_SID,
  PIPES_SIDS,
  POWER_LINES_SID,
  POWER_LINES_SIDS,
  REINFORCED_PIPES_SID,
  REINFORCED_POWER_LINES_SID,
  TUNNEL_SID,
  pipesBlock,
  powerLinesBlock,
  reinforcedPipesBlock,
  reinforcedPowerLinesBlock,
  tunnelBlock,
} from "../constants/blocks";

import { isBuildingBlock, isEnabled } from "./block";
import { getCellBlock } from "./map";
import { subtractResources } from "./utils";

export function addBoardResources(
  map: IMapBlock,
  addFn: (buildingBlock: IBuildingBlock) => void
): void {
  const boards = Object.values(map);
  for (const board of boards) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const buildingBlock = getCellBlock(board[i][j].buildings);
        if (isBuildingBlock(buildingBlock) && isEnabled(buildingBlock)) {
          addFn(buildingBlock);
        }
      }
    }
  }
}

export function getIncomes(map: IMapBlock): IResources {
  const incomes: IResources = {
    electronics: 0,
    food: 0,
    glass: 0,
    house: 0,
    money: 0,
    power: 0,
    "refined-metal": 0,
    spices: 0,
    "terra-tech": 0,
    water: 0,
  };
  addBoardResources(map, (buildingBlock: IBuildingBlock) => {
    if (buildingBlock.income) {
      for (const key in buildingBlock.income) {
        incomes[key as Resource] += buildingBlock.income[key as Resource] ?? 0;
      }
    }
  });
  return incomes;
}

export function getStorages(map: IMapBlock): IStorages {
  const storages: IStorages = {
    food: 0,
    glass: 0,
    house: 0,
    power: 0,
    "refined-metal": 0,
    water: 0,
  };
  addBoardResources(map, (buildingBlock: IBuildingBlock) => {
    if (buildingBlock.storage) {
      for (const key in buildingBlock.storage) {
        storages[key as Storage] += buildingBlock.storage[key as Storage] ?? 0;
      }
    }
  });
  return storages;
}

export function getConsumptions(map: IMapBlock): IConsumptions {
  const consumptions: IConsumptions = {
    power: 0,
    spices: 0,
    water: 0,
    worker: 0,
  };
  addBoardResources(map, (buildingBlock: IBuildingBlock) => {
    if (buildingBlock.consumption) {
      for (const key in buildingBlock.consumption) {
        consumptions[key as Consumption] +=
          buildingBlock.consumption[key as Consumption] ?? 0;
      }
    }
  });
  return consumptions;
}

export function getCost(
  selectedBuilding: IBuildingBlock,
  cell: ICellBlock
): Partial<ICosts> {
  let { cost } = selectedBuilding;
  if (cell.power && cell.power === POWER_LINES_SID) {
    cost = subtractResources(cost, powerLinesBlock.cost);
  } else if (cell.power && cell.power === REINFORCED_POWER_LINES_SID) {
    cost = subtractResources(cost, reinforcedPowerLinesBlock.cost);
  }
  if (cell.water && cell.water === PIPES_SID) {
    cost = subtractResources(cost, pipesBlock.cost);
  } else if (cell.water && cell.water === REINFORCED_PIPES_SID) {
    cost = subtractResources(cost, reinforcedPipesBlock.cost);
  }
  if (cell.tunnel) {
    cost = subtractResources(cost, tunnelBlock.cost);
  }
  return cost;
}

export function getRefund(
  block: IBuildingBlock,
  cell: ICellBlock
): Partial<ICosts> {
  if (
    block.sid === TUNNEL_SID ||
    POWER_LINES_SIDS.includes(block.sid) ||
    PIPES_SIDS.includes(block.sid)
  ) {
    return block.cost;
  }
  return getCost(block, cell);
}
