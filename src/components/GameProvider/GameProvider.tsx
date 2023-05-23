import type { BuildingTool, IBuildingBlock } from "../../types/block";
import type { IPoint } from "../../types/game";
import type { IMap } from "../../types/map";
import type { ReactNode } from "react";

import { useEffect, useMemo, useState } from "react";

import { gameContext } from "../../contexts/game";
import testMap from "../../data/map.json";
import { getBase } from "../../services/board";
import { getBlockMap, getTunnels } from "../../services/map";

export interface IGameProviderProps {
  children: ReactNode;
}

function GameProvider(props: IGameProviderProps): JSX.Element {
  const { children } = props;

  const [colonyLevel, setColonyLevel] = useState(0);
  const [map, setMap] = useState<IMap>(testMap);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuildingBlock>();
  const [selectedTile, setSelectedTile] = useState<IPoint>();
  const [selectedTool, setSelectedTool] = useState<BuildingTool>();

  useEffect(() => {
    if (colonyLevel === 0 && getBase(map)) {
      setColonyLevel(1);
    }
  }, [colonyLevel, map]);

  const tunnels = useMemo(() => getTunnels(map), [map]);
  const blockMap = useMemo(() => getBlockMap(map, tunnels), [map, tunnels]);
  const contextValue = useMemo(
    () => ({
      colonyLevel,
      map: blockMap,
      selectedBuilding,
      selectedTile,
      selectedTool,
      setMap,
      setSelectedBuilding,
      setSelectedTile,
      setSelectedTool,
      tunnels,
    }),
    [
      blockMap,
      colonyLevel,
      selectedBuilding,
      selectedTile,
      selectedTool,
      tunnels,
    ]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
