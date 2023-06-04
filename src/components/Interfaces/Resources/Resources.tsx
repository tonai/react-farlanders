import { useContext } from "react";

import electronics from "../../../../public/assets/resources/electronics.png";
import money from "../../../../public/assets/resources/money.png";
import spices from "../../../../public/assets/resources/spices.png";
import terraTech from "../../../../public/assets/resources/terra-tech.png";
import { gameContext } from "../../../contexts/game";

import "./Resources.css";
import Storage from "./Storage";

function Resources(): JSX.Element {
  const { income, resources, storage } = useContext(gameContext);

  return (
    <div className="Resources">
      <div className="Resources__row">
        <div className="Resources__item Resources__item--big">
          <img alt="Money" src={money} />
          <div className="Resources__total">{resources.money}</div>
          <div className="Resources__income">{income.money}</div>
        </div>
        <div className="Resources__item">
          <img alt="Money" src={terraTech} />
          <div className="Resources__total">{resources["terra-tech"]}</div>
          <div className="Resources__income">{income["terra-tech"]}</div>
        </div>
        <div className="Resources__item">
          <img alt="Money" src={spices} />
          <div className="Resources__total">{resources.spices}</div>
          <div className="Resources__income">{income.spices}</div>
        </div>
        <div className="Resources__item">
          <img alt="Money" src={electronics} />
          <div className="Resources__total">{resources.electronics}</div>
          <div className="Resources__income">{income.electronics}</div>
        </div>
      </div>
      <div className="Resources__row">
        <Storage
          income={income.power}
          resource={resources.power}
          storage={storage.power}
          type="power"
        />
        <Storage
          income={income.water}
          resource={resources.water}
          storage={storage.water}
          type="water"
        />
        <Storage
          income={income.food}
          resource={resources.food}
          storage={storage.food}
          type="food"
        />
        <Storage
          income={income["refined-metal"]}
          resource={resources["refined-metal"]}
          storage={storage["refined-metal"]}
          type="refined-metal"
        />
        <Storage
          income={income.glass}
          resource={resources.glass}
          storage={storage.glass}
          type="glass"
        />
      </div>
    </div>
  );
}

export default Resources;
