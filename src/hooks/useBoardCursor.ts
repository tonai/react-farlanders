import type { IPoint } from "../types/game";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";

import { useContext, useEffect } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";
import { gameContext } from "../contexts/game";

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
  const { setSelectedTile } = useContext(gameContext);

  useEffect(() => {
    function handleUnselect(): void {
      if (selectEl.current) {
        selectEl.current.style.display = "none";
      }
    }

    window.addEventListener("click", handleUnselect);
    return () => window.removeEventListener("click", handleUnselect);
  });

  function showHideElement(
    el: RefObject<HTMLDivElement>,
    event: MouseEvent
  ): IPoint | null {
    if (el.current) {
      const x = Math.floor(event.offsetX / BLOCK_SIZE);
      const y = Math.floor((event.offsetY + BLOCK_OFFSET) / BLOCK_SIZE);
      if (x >= 0 && y > 0) {
        el.current.style.transform = `translate(${x * BLOCK_SIZE}px, ${
          y * BLOCK_SIZE - BLOCK_OFFSET
        }px)`;
        el.current.style.display = "block";
        return { x, y };
      }
      el.current.style.display = "none";
    }
    return null;
  }

  function showCursor(event: MouseEvent): void {
    showHideElement(cursorEl, event);
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
    const point = showHideElement(selectEl, event.nativeEvent);
    if (point) {
      setSelectedTile(point);
    }
  }

  return {
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
}
