import type { IBuildingBlock } from "../../types/block";
import type { IPoint } from "../../types/game";
import type { IMap } from "../../types/map";
import type { ReactNode } from "react";

import { useEffect, useMemo, useState } from "react";

import {
  PIPES_SIDS,
  POWER_LINES_SIDS,
  REINFORCED_PIPES_SID,
  REINFORCED_POWER_LINES_SID,
} from "../../constants/blocks";
import { gameContext } from "../../contexts/game";
import testMap from "../../data/map.json";
import { getBase } from "../../services/board";
import { getConnections } from "../../services/connections";
import { getBlockMap } from "../../services/map";
import { BuildingTool } from "../../types/block";
import { View } from "../../types/game";

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
  const [view, setView] = useState<View>(View.Buildings);

  useEffect(() => {
    if (selectedBuilding && POWER_LINES_SIDS.includes(selectedBuilding.sid)) {
      setView(View.Power);
    } else if (selectedBuilding && PIPES_SIDS.includes(selectedBuilding.sid)) {
      setView(View.Water);
    } else if (selectedTool !== BuildingTool.Remove) {
      setView(View.Buildings);
    }
  }, [selectedBuilding, selectedTool]);

  useEffect(() => {
    if (colonyLevel === 0 && getBase(map)) {
      setColonyLevel(1);
    }
  }, [colonyLevel, map]);

  const base = useMemo(() => getBase(map), [map]);
  const tunnels = useMemo(
    () => getConnections(map, "buildings", base),
    [base, map]
  );
  const power = useMemo(
    () => getConnections(map, "power", base, POWER_LINES_SIDS),
    [base, map]
  );
  const reinforcedPower = useMemo(
    () => getConnections(map, "power", base, REINFORCED_POWER_LINES_SID),
    [base, map]
  );
  const water = useMemo(
    () => getConnections(map, "water", base, PIPES_SIDS),
    [base, map]
  );
  const reinforcedWater = useMemo(
    () => getConnections(map, "water", base, REINFORCED_PIPES_SID),
    [base, map]
  );
  const blockMap = useMemo(
    () =>
      getBlockMap(map, tunnels, power, reinforcedPower, water, reinforcedWater),
    [map, tunnels, power, reinforcedPower, reinforcedWater, water]
  );
  const contextValue = useMemo(
    () => ({
      colonyLevel,
      map: blockMap,
      power,
      selectedBuilding,
      selectedTile,
      selectedTool,
      setMap,
      setSelectedBuilding,
      setSelectedTile,
      setSelectedTool,
      setView,
      tunnels,
      view,
      water,
    }),
    [
      blockMap,
      colonyLevel,
      power,
      selectedBuilding,
      selectedTile,
      selectedTool,
      tunnels,
      view,
      water,
    ]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
