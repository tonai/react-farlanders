import type { IBuildingBlock } from "../../types/block";
import type { MouseEvent } from "react";

import classNames from "classnames";
import { useContext, useEffect, useState } from "react";

import { blockCategoryMap, categories } from "../../constants/blocks";
import { ESCAPE } from "../../constants/keys";
import { gameContext } from "../../contexts/game";
import { BuildingTool, GroundType } from "../../types/block";

import "./BuildingsInterface.css";

function BuildingsInterface(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>();
  const {
    selectedBuilding,
    selectedTool,
    setSelectedBuilding,
    setSelectedTool,
  } = useContext(gameContext);

  function handleActiveCategory(
    event: MouseEvent<HTMLButtonElement>,
    id: string
  ): void {
    event.stopPropagation();
    setActiveCategory(id);
    setSelectedBuilding(undefined);
    setSelectedTool(undefined);
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
    setSelectedTool(undefined);
  }

  function handleActiveTool(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    setActiveCategory(undefined);
    setSelectedTool(BuildingTool.Remove);
    setSelectedBuilding(undefined);
  }

  useEffect(() => {
    function unselect(): void {
      setActiveCategory(undefined);
      setSelectedBuilding(undefined);
      setSelectedTool(undefined);
    }

    function handleKeyUp(event: KeyboardEvent): void {
      if (event.code === ESCAPE) {
        unselect();
      }
    }

    function handleContextMenu(event: Event): void {
      event.preventDefault();
      unselect();
    }

    window.addEventListener("click", unselect);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("click", unselect);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [setSelectedBuilding, setSelectedTool]);

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
            {blockCategoryMap
              .get(category.id)
              ?.filter((block) => block.only !== GroundType.Underground)
              .map((block) => (
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
      <div
        className={classNames(
          "BuildingsInterface__category",
          "BuildingsInterface__category--tool",
          {
            "BuildingsInterface__category--active":
              selectedTool === BuildingTool.Remove,
          }
        )}
      >
        <button
          className="BuildingsInterface__button"
          onClick={handleActiveTool}
          type="button"
        >
          <img alt="Remove" src="/assets/categories/remove.png" />
        </button>
      </div>
    </div>
  );
}

export default BuildingsInterface;
