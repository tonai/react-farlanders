import type { BuildingTool, IBuildingBlock } from "../../types/block";
import type { IPoint } from "../../types/game";
import type { IMap } from "../../types/map";
import type { ReactNode } from "react";

import { useEffect, useMemo, useState } from "react";

import { BASE_SID } from "../../constants/blocks";
import { gameContext } from "../../contexts/game";
import testMap from "../../data/map.json";
import { getBlockMap, getMapBlockSid } from "../../services/map";

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
    if (colonyLevel === 0) {
      if (
        map[0].buildings
          .flat()
          .some((block) => getMapBlockSid(block) === BASE_SID)
      ) {
        setColonyLevel(1);
      }
    }
  }, [colonyLevel, map]);

  const blockMap = useMemo(() => getBlockMap(map), [map]);
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
    }),
    [blockMap, colonyLevel, selectedBuilding, selectedTile, selectedTool]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
