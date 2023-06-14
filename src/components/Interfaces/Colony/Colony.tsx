import classNames from "classnames";
import { useContext } from "react";

import housesImg from "../../../../public/assets/resources/houses.png";
import residentsImg from "../../../../public/assets/resources/residents.png";
import workersImg from "../../../../public/assets/resources/workers.png";
import { gameContext } from "../../../contexts/game";

import "./Colony.css";

function Colony(): JSX.Element {
  const { colonyLevel, consumptions, resources, storages } =
    useContext(gameContext);
  const background = `conic-gradient(green 0deg, #888 0deg)`;
  const workers = resources.house - consumptions.worker;

  return (
    <div className="Colony">
      <div className="Colony__group">
        <div className="Colony__level" style={{ background }}>
          <span>{colonyLevel}</span>
        </div>
        <div className="Colony__row Colony__houses">
          <img alt="Residents" src={residentsImg} />
          <div className="Colony__col">
            <div
              className={classNames("Colony__big", {
                "Colony--error": storages.house < resources.house,
              })}
            >
              {resources.house}
            </div>
            <div>
              / <img alt="houses" src={housesImg} /> {storages.house}
            </div>
          </div>
        </div>
        <div className="Colony__row Colony__workers">
          <img alt="Workers" src={workersImg} />
          <div
            className={classNames("Colony__big", {
              "Colony--error": workers < 0,
            })}
          >
            {workers}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Colony;
