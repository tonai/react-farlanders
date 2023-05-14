import type {
  IBlockCategories,
  IBuildingBlock,
  IBuildingBlocks,
} from "../../types/block";
import type { MouseEvent } from "react";

import classNames from "classnames";
import { useContext, useEffect, useState } from "react";

import { ESCAPE } from "../../constants/keys";
import { gameContext } from "../../contexts/game";
import buildingBlocks from "../../data/building-blocks.json";
import buildingCategories from "../../data/buildings-categories.json";

import "./BuildingsInterface.css";

const blocks = buildingBlocks as IBuildingBlocks;
const categories = buildingCategories as IBlockCategories;
const blockCategoryMap = blocks.reduce((acc, block) => {
  if (acc.has(block.category)) {
    acc.get(block.category)?.push(block);
  } else {
    acc.set(block.category, [block]);
  }
  return acc;
}, new Map<string, IBuildingBlocks>());

function BuildingsInterface(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>();
  const { selectedBuilding, setSelectedBuilding } = useContext(gameContext);

  function handleActiveCategory(
    event: MouseEvent<HTMLButtonElement>,
    id: string
  ): void {
    event.stopPropagation();
    setActiveCategory(id);
    setSelectedBuilding(undefined);
  }

  function handlePropagation(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  function handleActiveBuilding(
    event: MouseEvent<HTMLButtonElement>,
    block: IBuildingBlock
  ): void {
    event.stopPropagation();
    setSelectedBuilding(block);
  }

  useEffect(() => {
    function handleClick(): void {
      setActiveCategory(undefined);
      setSelectedBuilding(undefined);
    }

    function handleKeyUp(event: KeyboardEvent): void {
      if (event.code === ESCAPE) {
        setActiveCategory(undefined);
        setSelectedBuilding(undefined);
      }
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setSelectedBuilding]);

  return (
    <div className="BuildingsInterface">
      {categories.map((category) => (
        <div
          key={category.id}
          className={classNames("BuildingsInterface__category", {
            "BuildingsInterface__category--active":
              activeCategory === category.id,
          })}
        >
          <button
            className="BuildingsInterface__button"
            onClick={(e) => handleActiveCategory(e, category.id)}
            type="button"
          >
            <img
              alt={category.title}
              className="BuildingsInterface__image"
              src={category.images}
            />
          </button>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="BuildingsInterface__blocks"
            onClick={handlePropagation}
          >
            {blockCategoryMap.get(category.id)?.map((block) => (
              <button
                key={block.id}
                className={classNames("BuildingsInterface__blocks-button", {
                  "BuildingsInterface__blocks-button--active":
                    selectedBuilding === block,
                })}
                onClick={(e) => handleActiveBuilding(e, block)}
                type="button"
              >
                <img
                  alt={block.title}
                  className="BuildingsInterface__image"
                  src={block.images}
                />
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="BuildingsInterface__category">
        <button className="BuildingsInterface__button" type="button">
          <img alt="Remove" src="/assets/categories/remove.png" />
        </button>
      </div>
    </div>
  );
}

export default BuildingsInterface;
