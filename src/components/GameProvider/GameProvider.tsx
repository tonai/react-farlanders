import type { IPoint } from "../../types/game";
import type { ReactNode } from "react";

import { useMemo, useState } from "react";

import { gameContext } from "../../contexts/game";

export interface IGameProviderProps {
  children: ReactNode;
}

function GameProvider(props: IGameProviderProps): JSX.Element {
  const { children } = props;

  const [selectedTile, setSelectedTile] = useState<IPoint>();

  const contextValue = useMemo(
    () => ({
      selectedTile,
      setSelectedTile,
    }),
    [selectedTile]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
