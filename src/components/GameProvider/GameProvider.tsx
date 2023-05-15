import type { IBuildingBlock } from "../../types/block";
import type { IPoint } from "../../types/game";
import type { IMap } from "../../types/map";
import type { ReactNode } from "react";

import { useMemo, useState } from "react";

import { gameContext } from "../../contexts/game";
import testMap from "../../data/map.json";

export interface IGameProviderProps {
  children: ReactNode;
}

function GameProvider(props: IGameProviderProps): JSX.Element {
  const { children } = props;

  const [map, setMap] = useState<IMap>(testMap);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuildingBlock>();
  const [selectedTile, setSelectedTile] = useState<IPoint>();

  const contextValue = useMemo(
    () => ({
      map,
      selectedBuilding,
      selectedTile,
      setMap,
      setSelectedBuilding,
      setSelectedTile,
    }),
    [map, selectedBuilding, selectedTile]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
