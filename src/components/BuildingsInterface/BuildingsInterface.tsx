import type { IBlockCategories, IBuildingBlocks } from "../../types/block";
import type { MouseEvent } from "react";

import classNames from "classnames";
import { useEffect, useState } from "react";

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

  function handleActiveCategory(
    event: MouseEvent<HTMLButtonElement>,
    id: string
  ): void {
    event.stopPropagation();
    setActiveCategory(id);
  }

  useEffect(() => {
    function handleClearCategory(): void {
      setActiveCategory(undefined);
    }

    window.addEventListener("click", handleClearCategory);
    return () => window.removeEventListener("click", handleClearCategory);
  }, []);

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
          <div className="BuildingsInterface__blocks">
            {blockCategoryMap.get(category.id)?.map((block) => (
              <button
                key={block.id}
                className="BuildingsInterface__blocks-button"
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
