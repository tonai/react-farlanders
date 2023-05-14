import type { IGameContext } from "../types/game";

import { createContext } from "react";

export const gameContext = createContext<IGameContext>({
  setSelectedBuilding: () => undefined,
  setSelectedTile: () => undefined,
});
