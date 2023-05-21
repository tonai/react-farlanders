import type { BuildingTool, IBuildingBlock } from "../../types/block";
import type { IPoint } from "../../types/game";
import type { IMap } from "../../types/map";
import type { ReactNode } from "react";

import { useMemo, useState } from "react";

import { gameContext } from "../../contexts/game";
import testMap from "../../data/map.json";
import { getBlockMap } from "../../services/map";

export interface IGameProviderProps {
  children: ReactNode;
}

function GameProvider(props: IGameProviderProps): JSX.Element {
  const { children } = props;

  const [map, setMap] = useState<IMap>(testMap);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuildingBlock>();
  const [selectedTile, setSelectedTile] = useState<IPoint>();
  const [selectedTool, setSelectedTool] = useState<BuildingTool>();

  const blockMap = useMemo(() => getBlockMap(map), [map]);
  const contextValue = useMemo(
    () => ({
      map: blockMap,
      selectedBuilding,
      selectedTile,
      selectedTool,
      setMap,
      setSelectedBuilding,
      setSelectedTile,
      setSelectedTool,
    }),
    [blockMap, selectedBuilding, selectedTile, selectedTool]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
