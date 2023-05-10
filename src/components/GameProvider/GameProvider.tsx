import { ReactNode, useMemo, useState } from "react";

import { gameContext } from "../../contexts/game";
import { IPoint } from "../../types/game";

export interface IGameProviderProps {
  children: ReactNode;
}

function GameProvider(props: IGameProviderProps) {
  const { children } = props;

  const [selectedTile, setSelectedTile] = useState<IPoint>()

  const contextValue = useMemo(() => ({
    selectedTile,
    setSelectedTile,
  }), [selectedTile]);

  return <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>;
}

export default GameProvider;
