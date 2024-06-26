import type { BuildingTool, IBuildingBlock } from "../../types/block";
import type { IPoint } from "../../types/game";
import type { IMap } from "../../types/map";
import type { IResources } from "../../types/resources";
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
import { getMapBlock } from "../../services/map";
import {
  getConsumptions,
  getIncomes,
  getStorages,
} from "../../services/resources";
import { View } from "../../types/game";
import { CellType } from "../../types/map";

const depth = 0;

export interface IGameProviderProps {
  children: ReactNode;
}

function GameProvider(props: IGameProviderProps): JSX.Element {
  const { children } = props;

  const [colonyLevel, setColonyLevel] = useState(0);
  const [map, setMap] = useState<IMap>(testMap);
  const [resources, setResources] = useState<IResources>({
    electronics: 0,
    food: 0,
    glass: 0,
    house: 0,
    money: 0,
    power: 0,
    "refined-metal": 0,
    spices: 0,
    "terra-tech": 0,
    water: 0,
  });
  const [selectedBuilding, setSelectedBuilding] = useState<IBuildingBlock>();
  const [selectedTile, setSelectedTile] = useState<IPoint>();
  const [selectedTool, setSelectedTool] = useState<BuildingTool>();
  const [view, setView] = useState<View>(View.Buildings);

  const basePoint = useMemo(() => getBase(map), [map]);
  const tunnels = useMemo(
    () => getConnections(map[depth], CellType.Tunnel, basePoint),
    [basePoint, map]
  );
  const power = useMemo(
    () =>
      getConnections(map[depth], CellType.Power, basePoint, POWER_LINES_SIDS),
    [basePoint, map]
  );
  const reinforcedPower = useMemo(
    () =>
      getConnections(
        map[depth],
        CellType.Power,
        basePoint,
        REINFORCED_POWER_LINES_SID
      ),
    [basePoint, map]
  );
  const water = useMemo(
    () => getConnections(map[depth], CellType.Water, basePoint, PIPES_SIDS),
    [basePoint, map]
  );
  const reinforcedWater = useMemo(
    () =>
      getConnections(
        map[depth],
        CellType.Water,
        basePoint,
        REINFORCED_PIPES_SID
      ),
    [basePoint, map]
  );
  const blockMap = useMemo(
    () =>
      getMapBlock(map, tunnels, power, reinforcedPower, water, reinforcedWater),
    [map, tunnels, power, reinforcedPower, reinforcedWater, water]
  );
  const incomes = useMemo(() => getIncomes(blockMap), [blockMap]);
  const storages = useMemo(() => getStorages(blockMap), [blockMap]);
  const consumptions = useMemo(() => getConsumptions(blockMap), [blockMap]);
  const contextValue = useMemo(
    () => ({
      colonyLevel,
      consumptions,
      depth,
      incomes,
      map: blockMap,
      power,
      resources,
      selectedBuilding,
      selectedTile,
      selectedTool,
      setMap,
      setResources,
      setSelectedBuilding,
      setSelectedTile,
      setSelectedTool,
      setView,
      storages,
      tunnels,
      view,
      water,
    }),
    [
      blockMap,
      colonyLevel,
      consumptions,
      incomes,
      power,
      resources,
      selectedBuilding,
      selectedTile,
      selectedTool,
      storages,
      tunnels,
      view,
      water,
    ]
  );

  useEffect(() => {
    if (selectedBuilding && POWER_LINES_SIDS.includes(selectedBuilding.sid)) {
      setView(View.Power);
    } else if (selectedBuilding && PIPES_SIDS.includes(selectedBuilding.sid)) {
      setView(View.Water);
    } else if (selectedBuilding) {
      setView(View.Buildings);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (colonyLevel === 0 && basePoint) {
      setColonyLevel(1);
    }
  }, [basePoint, colonyLevel]);

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
}

export default GameProvider;
