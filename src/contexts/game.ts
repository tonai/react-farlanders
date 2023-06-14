import type { IGameContext } from "../types/game";

import { createContext } from "react";

import { View } from "../types/game";

export const gameContext = createContext<IGameContext>({
  colonyLevel: 0,
  consumptions: {
    power: 0,
    spices: 0,
    water: 0,
    worker: 0,
  },
  depth: 0,
  incomes: {
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
  },
  map: {
    "0": [],
  },
  power: [],
  resources: {
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
  },
  setMap: () => undefined,
  setResources: () => undefined,
  setSelectedBuilding: () => undefined,
  setSelectedTile: () => undefined,
  setSelectedTool: () => undefined,
  setView: () => undefined,
  storages: {
    food: 0,
    glass: 0,
    house: 0,
    power: 0,
    "refined-metal": 0,
    water: 0,
  },
  tunnels: [],
  view: View.Buildings,
  water: [],
});
