import type { IGameContext } from "../types/game";

import { createContext } from "react";

import { View } from "../types/game";

export const gameContext = createContext<IGameContext>({
  colonyLevel: 0,
  depth: 0,
  map: {
    "0": [],
  },
  power: [],
  setMap: () => undefined,
  setSelectedBuilding: () => undefined,
  setSelectedTile: () => undefined,
  setSelectedTool: () => undefined,
  setView: () => undefined,
  tunnels: [],
  view: View.Buildings,
  water: [],
});
