import { MouseEvent as ReactMouseEvent, RefObject, useContext, useEffect } from "react";

import { BLOCK_OFFSET, BLOCK_SIZE } from "../constants/blocks";
import { gameContext } from "../contexts/game";

export function useBoardCursor(
  rootEl: RefObject<HTMLDivElement>,
  cursorEl: RefObject<HTMLDivElement>,
  selectEl: RefObject<HTMLDivElement>
) {
  const { setSelectedTile } = useContext(gameContext)

  useEffect(() => {
    function handleUnselect() {
      if (selectEl.current) {
        selectEl.current.style.display = "none";
      }
    }
    
    window.addEventListener('click', handleUnselect);
    return () => window.removeEventListener('click', handleUnselect);
  });

  function showHideElement(el: RefObject<HTMLDivElement>, event: MouseEvent) {
    if (el.current) {
      const x = Math.floor(event.offsetX / BLOCK_SIZE);
      const y = Math.floor((event.offsetY + BLOCK_OFFSET) / BLOCK_SIZE);
      if (x >= 0 && y > 0) {
        el.current.style.transform = `translate(${x * BLOCK_SIZE}px, ${
          y * BLOCK_SIZE - BLOCK_OFFSET
        }px)`;
        el.current.style.display = "block";
        return { x, y };
      } else {
        el.current.style.display = "none";
      }
    }
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>) {
    if (rootEl.current) {
      rootEl.current.addEventListener("mousemove", showCursor);
      showCursor(event.nativeEvent);
    }
  }

  function showCursor(event: MouseEvent) {
    showHideElement(cursorEl, event);
  }

  function handleMouseLeave() {
    if (rootEl.current) {
      rootEl.current.removeEventListener("mousemove", showCursor);
      if (cursorEl.current) {
        cursorEl.current.style.display = "none";
      }
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLDivElement>) {
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
