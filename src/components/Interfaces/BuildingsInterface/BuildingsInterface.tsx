import type { IBuildingBlock } from "../../../types/block";
import type { MouseEvent } from "react";

import classNames from "classnames";
import { useCallback, useContext, useEffect, useState } from "react";

import {
  BASE_SID,
  blockCategoryMap,
  categories,
} from "../../../constants/blocks";
import { ESCAPE } from "../../../constants/keys";
import { gameContext } from "../../../contexts/game";
import { BuildingTool, GroundType } from "../../../types/block";

import "./BuildingsInterface.css";

function BuildingsInterface(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>();
  const {
    colonyLevel,
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

  const unselect = useCallback((): void => {
    setActiveCategory(undefined);
    setSelectedBuilding(undefined);
    setSelectedTool(undefined);
  }, [setSelectedBuilding, setSelectedTool]);

  useEffect(() => {
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
  }, [unselect]);

  useEffect(() => {
    if (colonyLevel === 1 && selectedBuilding?.sid === BASE_SID) {
      unselect();
    }
  }, [colonyLevel, selectedBuilding, unselect]);

  return (
    <div className="BuildingsInterface">
      {categories.map((category) => {
        const categoryBlocks = blockCategoryMap
          .get(category.id)
          ?.filter(
            (block) =>
              block.only !== GroundType.Underground &&
              ((colonyLevel === 0 && block.sid === BASE_SID) ||
                (colonyLevel > 0 && block.sid !== BASE_SID))
          );
        return (
          <div
            key={category.id}
            className={classNames("BuildingsInterface__category", {
              "BuildingsInterface__category--active":
                activeCategory === category.id,
            })}
          >
            <button
              className="BuildingsInterface__button"
              disabled={!categoryBlocks || categoryBlocks.length === 0}
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
              {categoryBlocks?.map((block) => (
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
        );
      })}
      <div
        className={classNames("BuildingsInterface__category", {
          "BuildingsInterface__category--active":
            selectedTool === BuildingTool.Remove,
        })}
      >
        <button
          className="BuildingsInterface__button BuildingsInterface__button--tool"
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