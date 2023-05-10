import { createContext } from "react";

import { GameContext } from "../types/game";

export const gameContext = createContext<GameContext>({
  setSelectedTile: () => null,
});
