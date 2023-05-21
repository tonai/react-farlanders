import type { IGameContext } from "../types/game";

import { createContext } from "react";

export const gameContext = createContext<IGameContext>({
  map: {
    "0": { buildings: [], land: [], landforms: [] },
  },
  setMap: () => undefined,
  setSelectedBuilding: () => undefined,
  setSelectedTile: () => undefined,
});
