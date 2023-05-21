import type { IBlock } from "../types/block";
import type { IPoint } from "../types/game";
import type { IImage } from "../types/image";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

import { useCallback, useContext, useEffect } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";
import { gameContext } from "../contexts/game";
import { isBuildable } from "../services/board";
import { addBlockToMap } from "../services/map";

export interface IBoardCursorHook {
  onClick: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onMouseMove: (event: ReactMouseEvent<HTMLDivElement>) => void;
}

export function useBoardCursor(
  cursorEl: RefObject<HTMLDivElement>,
  selectEl: RefObject<HTMLDivElement>,
  imageMap: Map<IBlock, IImage>,
  level = 0
): IBoardCursorHook {
  const { map, selectedBuilding, setMap, setSelectedTile } =
    useContext(gameContext);

  useEffect(() => {
    if (cursorEl.current) {
      if (selectedBuilding) {
        cursorEl.current.style.backgroundImage = `url(${selectedBuilding.images})`;
        const image = imageMap.get(selectedBuilding);
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
        cursorEl.current.style.filter = "none";
      }
    }
  }, [cursorEl, imageMap, selectedBuilding]);

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

  function showCursor(event: MouseEvent): void {
    const point = getPoint(event);
    showHideElement(cursorEl, point);
    if (point && selectedBuilding && cursorEl.current) {
      if (isBuildable(map[level], point, selectedBuilding)) {
        cursorEl.current.style.filter = "none";
      } else {
        cursorEl.current.style.filter =
          "saturate(0) sepia(1) hue-rotate(-50deg) saturate(4)";
      }
    }
  }

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>): void {
    showCursor(event.nativeEvent);
  }

  function handleMouseLeave(): void {
    if (cursorEl.current) {
      cursorEl.current.style.display = "none";
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const point = getPoint(event.nativeEvent);
    if (point) {
      if (selectedBuilding) {
        if (isBuildable(map[level], point, selectedBuilding)) {
          setMap((map) => addBlockToMap(map, selectedBuilding, point));
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
