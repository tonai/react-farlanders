import type { IPoint } from "../types/game";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

import { useCallback, useContext, useEffect } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";
import { gameContext } from "../contexts/game";
import { addBlockToMap } from "../services/map";

export interface IBoardCursorHook {
  onClick: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

export function useBoardCursor(
  rootEl: RefObject<HTMLDivElement>,
  cursorEl: RefObject<HTMLDivElement>,
  selectEl: RefObject<HTMLDivElement>
): IBoardCursorHook {
  const { selectedBuilding, setMap, setSelectedTile } = useContext(gameContext);

  const unselect = useCallback(() => {
    if (selectEl.current) {
      setSelectedTile(undefined);
      selectEl.current.style.display = "none";
    }
  }, [selectEl, setSelectedTile]);

  useEffect(() => {
    window.addEventListener("click", unselect);
    return () => window.removeEventListener("click", unselect);
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

  function showCursor(event: MouseEvent): void {
    const point = getPoint(event);
    showHideElement(cursorEl, point);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>): void {
    if (rootEl.current) {
      rootEl.current.addEventListener("mousemove", showCursor);
      showCursor(event.nativeEvent);
    }
  }

  function handleMouseLeave(): void {
    if (rootEl.current) {
      rootEl.current.removeEventListener("mousemove", showCursor);
      if (cursorEl.current) {
        cursorEl.current.style.display = "none";
      }
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const point = getPoint(event.nativeEvent);
    if (point) {
      if (selectedBuilding) {
        setMap((map) => addBlockToMap(map, selectedBuilding, point));
        unselect();
      } else {
        showHideElement(selectEl, point);
        setSelectedTile(point);
      }
    }
  }

  return {
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
}
