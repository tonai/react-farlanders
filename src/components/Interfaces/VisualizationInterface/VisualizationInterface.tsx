import classNames from "classnames";
import { useContext } from "react";

import buildings from "../../../../public/assets/visualization/buildings.png";
import power from "../../../../public/assets/visualization/power.png";
import water from "../../../../public/assets/visualization/water.png";
import { gameContext } from "../../../contexts/game";
import { View } from "../../../types/game";

import "./VisualizationInterface.css";

function VisualizationInterface(): JSX.Element {
  const { setView, view } = useContext(gameContext);

  function handleToggleView(view: View): void {
    setView(view);
  }

  return (
    <div className="VisualizationInterface">
      <button
        className={classNames("VisualizationInterface__button", {
          "VisualizationInterface__button--active": view === View.Buildings,
        })}
        onClick={() => handleToggleView(View.Buildings)}
        type="button"
      >
        <img
          alt="Toogle full view"
          className="VisualizationInterface__image"
          src={buildings}
        />
      </button>
      <button
        className={classNames("VisualizationInterface__button", {
          "VisualizationInterface__button--active": view === View.Power,
        })}
        onClick={() => handleToggleView(View.Power)}
        type="button"
      >
        <img
          alt="Toogle power view"
          className="VisualizationInterface__image"
          src={power}
        />
      </button>
      <button
        className={classNames("VisualizationInterface__button", {
          "VisualizationInterface__button--active": view === View.Water,
        })}
        onClick={() => handleToggleView(View.Water)}
        type="button"
      >
        <img
          alt="Toogle water view"
          className="VisualizationInterface__image"
          src={water}
        />
      </button>
    </div>
  );
}

export default VisualizationInterface;
