import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

import { useCallback, useContext, useEffect } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";
import { gameContext } from "../contexts/game";
import { isBuildable, isRemovable } from "../services/board";
import { addBlockToMap, removeBlockFromMap } from "../services/map";

export interface IBoardCursorHook {
  onClick: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onMouseMove: (event: ReactMouseEvent<HTMLDivElement>) => void;
}

export function useBoardCursor(
  cursorEl: RefObject<HTMLDivElement>,
  selectEl: RefObject<HTMLDivElement>,
  imageMap: Map<number, IImage>,
  level = 0
): IBoardCursorHook {
  const { map, selectedBuilding, selectedTool, setMap, setSelectedTile } =
    useContext(gameContext);

  useEffect(() => {
    if (cursorEl.current) {
      cursorEl.current.style.backgroundColor = "transparent";
      cursorEl.current.style.filter = "none";
      if (selectedBuilding) {
        cursorEl.current.style.backgroundImage = `url(${selectedBuilding.images})`;
        const image = imageMap.get(selectedBuilding.sid);
        if (image) {
          cursorEl.current.style.height = `${image.height}px`;
          cursorEl.current.style.width = `${image.width}px`;
          cursorEl.current.style.top = `${BLOCK_SIZE - image.height}px`;
        }
      } else {
        cursorEl.current.style.backgroundImage = "none";
        cursorEl.current.style.height = `${BLOCK_SIZE}px`;
        cursorEl.current.style.width = `${BLOCK_SIZE}px`;
        cursorEl.current.style.top = "0px";
      }
    }
  }, [cursorEl, imageMap, selectedBuilding, selectedTool]);

  const unselect = useCallback(() => {
    if (selectEl.current) {
      setSelectedTile(undefined);
      selectEl.current.style.display = "none";
    }
  }, [selectEl, setSelectedTile]);

  useEffect(() => {
    window.addEventListener("click", unselect, { capture: true });
    return () =>
      window.removeEventListener("click", unselect, { capture: true });
  }, [unselect]);

  function getPoint(event: MouseEvent): IPoint | undefined {
    const x = Math.floor(event.offsetX / BLOCK_SIZE);
    const y = Math.floor((event.offsetY + BLOCK_OFFSET) / BLOCK_SIZE);
    if (x >= 0 && y > 0) {
      return { x, y };
    }
    return undefined;
  }

  function showHideElement(
    el: RefObject<HTMLDivElement>,
    point?: IPoint
  ): void {
    if (el.current) {
      if (point) {
        const { x, y } = point;
        if (x >= 0 && y > 0) {
          el.current.style.transform = `translate(${x * BLOCK_SIZE}px, ${
            y * BLOCK_SIZE - BLOCK_OFFSET
          }px)`;
          el.current.style.display = "block";
          return;
        }
      }
      el.current.style.display = "none";
    }
  }

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>): void {
    const point = getPoint(event.nativeEvent);
    showHideElement(cursorEl, point);
    if (point && cursorEl.current) {
      const { x, y } = point;
      cursorEl.current.style.display = "block";
      if (selectedBuilding) {
        if (isBuildable(map[level], y - 1, x, selectedBuilding)) {
          cursorEl.current.style.filter = "none";
        } else {
          cursorEl.current.style.filter =
            "saturate(0) sepia(1) hue-rotate(-50deg) saturate(4)";
        }
      } else if (selectedTool) {
        if (isRemovable(map[level], y - 1, x)) {
          cursorEl.current.style.backgroundColor = "transparent";
        } else {
          cursorEl.current.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        }
      }
    }
  }

  function handleMouseLeave(): void {
    if (cursorEl.current) {
      cursorEl.current.style.backgroundColor = "transparent";
      cursorEl.current.style.display = "none";
      cursorEl.current.style.filter = "none";
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const point = getPoint(event.nativeEvent);
    if (point) {
      const { x, y } = point;
      if (selectedBuilding) {
        if (isBuildable(map[level], y - 1, x, selectedBuilding)) {
          setMap((map) => addBlockToMap(map, selectedBuilding, point));
        }
      } else if (selectedTool) {
        if (isRemovable(map[level], y - 1, x)) {
          setMap((map) => removeBlockFromMap(map, point));
        }
      } else {
        showHideElement(selectEl, point);
        setSelectedTile(point);
      }
    }
  }

  return {
    onClick: handleClick,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
  };
}
