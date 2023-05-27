import type { IGameContext } from "../types/game";

import { createContext } from "react";

import { View } from "../types/game";

export const gameContext = createContext<IGameContext>({
  colonyLevel: 0,
  map: {
    "0": { buildings: [], land: [], power: [], water: [] },
  },
  setMap: () => undefined,
  setSelectedBuilding: () => undefined,
  setSelectedTile: () => undefined,
  setSelectedTool: () => undefined,
  setView: () => undefined,
  view: View.Buildings,
});
