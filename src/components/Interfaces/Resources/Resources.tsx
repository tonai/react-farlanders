import { useContext } from "react";

import electronicsImg from "../../../../public/assets/resources/electronics.png";
import moneyImg from "../../../../public/assets/resources/money.png";
import spicesImg from "../../../../public/assets/resources/spices.png";
import terraTechImg from "../../../../public/assets/resources/terra-tech.png";
import { gameContext } from "../../../contexts/game";

import "./Resources.css";
import Storage from "./Storage";

function Resources(): JSX.Element {
  const { consumptions, incomes, resources, storages } =
    useContext(gameContext);

  return (
    <div className="Resources">
      <div className="Resources__row">
        <div className="Resources__item Resources__item--big">
          <img alt="Money" src={moneyImg} />
          <div className="Resources__total">{resources.money}</div>
          <div className="Resources__income">{incomes.money}</div>
        </div>
        <div className="Resources__item">
          <img alt="TerraTech" src={terraTechImg} />
          <div className="Resources__total">{resources["terra-tech"]}</div>
          <div className="Resources__income">{incomes["terra-tech"]}</div>
        </div>
        <div className="Resources__item">
          <img alt="Spices" src={spicesImg} />
          <div className="Resources__total">{resources.spices}</div>
          <div className="Resources__income">
            {incomes.spices - consumptions.spices}
          </div>
        </div>
        <div className="Resources__item">
          <img alt="Electronics" src={electronicsImg} />
          <div className="Resources__total">{resources.electronics}</div>
          <div className="Resources__income">{incomes.electronics}</div>
        </div>
      </div>
      <div className="Resources__row">
        <Storage
          income={incomes.power - consumptions.power - resources.house}
          resource={resources.power}
          storage={storages.power}
          type="power"
        />
        <Storage
          income={incomes.water - consumptions.water - resources.house}
          resource={resources.water}
          storage={storages.water}
          type="water"
        />
        <Storage
          income={incomes.food - resources.house}
          resource={resources.food}
          storage={storages.food}
          type="food"
        />
        <Storage
          income={incomes["refined-metal"]}
          resource={resources["refined-metal"]}
          storage={storages["refined-metal"]}
          type="refined-metal"
        />
        <Storage
          income={incomes.glass}
          resource={resources.glass}
          storage={storages.glass}
          type="glass"
        />
      </div>
    </div>
  );
}

export default Resources;
