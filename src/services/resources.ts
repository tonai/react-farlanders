import type { IMapBlock } from "../types/map";
import type { IResources, IStorages } from "../types/resources";

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

export function addBoardResources<T extends Record<string, number>>(
  map: IMapBlock,
  resources: T,
  type: "income" | "storage"
): void {
  const boards = Object.values(map);
  for (const board of boards) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const buildingBlock = getCellBlock(board[i][j].buildings);
        if (
          isBuildingBlock(buildingBlock) &&
          isEnabled(buildingBlock) &&
          buildingBlock[type]
        ) {
          for (const storage in buildingBlock[type]) {
            // @ts-expect-error complex typing
            resources[storage] += buildingBlock[type][storage];
          }
        }
      }
    }
  }
}

export function getIncome(map: IMapBlock): IResources {
  const income: IResources = {
    electronics: 0,
    food: 0,
    glass: 0,
    money: 0,
    power: 0,
    "refined-metal": 0,
    spices: 0,
    "terra-tech": 0,
    water: 0,
  };
  addBoardResources(map, income, "income");
  return income;
}

export function getStorage(map: IMapBlock): IStorages {
  const storages: IStorages = {
    food: 0,
    glass: 0,
    power: 0,
    "refined-metal": 0,
    water: 0,
  };
  addBoardResources(map, storages, "storage");
  return storages;
}
