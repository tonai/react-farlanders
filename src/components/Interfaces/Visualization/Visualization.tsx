import classNames from "classnames";
import { useContext } from "react";

import buildingsImg from "../../../../public/assets/visualization/buildings.png";
import powerImg from "../../../../public/assets/visualization/power.png";
import waterImg from "../../../../public/assets/visualization/water.png";
import { gameContext } from "../../../contexts/game";
import { View } from "../../../types/game";

import "./Visualization.css";

function Visualization(): JSX.Element {
  const { setView, view } = useContext(gameContext);

  function handleToggleView(view: View): void {
    setView(view);
  }

  return (
    <div className="Visualization">
      <button
        className={classNames("Visualization__button", {
          "Visualization__button--active": view === View.Buildings,
        })}
        onClick={() => handleToggleView(View.Buildings)}
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
        onClick={() => handleToggleView(View.Power)}
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
        onClick={() => handleToggleView(View.Water)}
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
