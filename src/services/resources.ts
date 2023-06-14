import type { IBuildingBlock } from "../types/block";
import type { IMapBlock } from "../types/map";
import type {
  Consumption,
  IConsumptions,
  IResources,
  IStorages,
  Resource,
  Storage,
} from "../types/resources";

import { isBuildingBlock, isEnabled } from "./block";
import { getCellBlock } from "./map";

export function addResources<T extends Record<string, number>>(
  prevResources: T,
  addResources: Partial<T>
): T {
  return Object.fromEntries(
    Object.entries(prevResources).map(([resource, value]) => [
      resource,
      addResources[resource] ?? 0 + value,
    ])
  ) as T;
}

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
