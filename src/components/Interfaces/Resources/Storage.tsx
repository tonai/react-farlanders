import classNames from "classnames";

import { RESOURCE_PATH } from "../../../constants/blocks";

export interface IStorageProps {
  income: number;
  resource: number;
  storage: number;
  type: string;
}

function Storage(props: IStorageProps): JSX.Element {
  const { income, resource, storage, type } = props;
  const percentage = storage ? resource / storage : 0;

  return (
    <div className="Resources__item">
      <img alt={type} src={`${RESOURCE_PATH}${type}.png`} />
      <div className="Resources__group">
        <div className="Resources__resource">
          <div className="Resources__total">{resource}</div>
          <div
            className={classNames("Resources__income", {
              "Resources__income--negative": income < 0,
              "Resources__income--positive": income > 0,
            })}
          >
            {income}
          </div>
        </div>
        <div className="Resources__storage">
          <div className="Resources__progress">
            <div
              className={classNames("Resources__bar", {
                "Resources__bar--full": percentage === 1,
                "Resources__bar--overflow": (resource + income) / storage > 1,
              })}
              style={{ flex: percentage }}
            />
          </div>
          <div>{storage}</div>
        </div>
      </div>
    </div>
  );
}

export default Storage;
