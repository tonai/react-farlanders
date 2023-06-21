import type { MouseEvent } from "react";

import classNames from "classnames";
import { useContext } from "react";

import buildingsImg from "../../../../public/assets/visualization/buildings.png";
import powerImg from "../../../../public/assets/visualization/power.png";
import waterImg from "../../../../public/assets/visualization/water.png";
import { gameContext } from "../../../contexts/game";
import { View } from "../../../types/game";

import "./Visualization.css";

function Visualization(): JSX.Element {
  const { selectedTool, setView, view } = useContext(gameContext);

  function handleToggleView(
    event: MouseEvent<HTMLButtonElement>,
    view: View
  ): void {
    if (selectedTool) {
      event.stopPropagation();
    }
    setView(view);
  }

  return (
    <div className="Visualization">
      <button
        className={classNames("Visualization__button", {
          "Visualization__button--active": view === View.Buildings,
        })}
        onClick={(e) => handleToggleView(e, View.Buildings)}
        type="button"
      >
        <img
          alt="Toogle full view"
          className="Visualization__image"
          src={buildingsImg}
        />
      </button>
      <button
        className={classNames("Visualization__button", {
          "Visualization__button--active": view === View.Power,
        })}
        onClick={(e) => handleToggleView(e, View.Power)}
        type="button"
      >
        <img
          alt="Toogle power view"
          className="Visualization__image"
          src={powerImg}
        />
      </button>
      <button
        className={classNames("Visualization__button", {
          "Visualization__button--active": view === View.Water,
        })}
        onClick={(e) => handleToggleView(e, View.Water)}
        type="button"
      >
        <img
          alt="Toogle water view"
          className="Visualization__image"
          src={waterImg}
        />
      </button>
    </div>
  );
}

export default Visualization;
