import { MouseEvent as ReactMouseEvent, PointerEvent, RefObject, TouchEvent, useRef } from "react";

import { IPoint } from "../CameraControls/CameraControls";

export function useCameraDrag(
  rootEl: RefObject<HTMLDivElement>,
  boardEl: RefObject<HTMLDivElement>
) {
  const dragPoint = useRef<IPoint>();

  function handleMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    if (boardEl.current && event.button === 0 && !dragPoint.current) {
      dragPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
      boardEl.current.addEventListener("mousemove", handleMove);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (boardEl.current && !dragPoint.current) {
      dragPoint.current = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    }
  }

  function handleMove(event: MouseEvent | TouchEvent) {
    if (rootEl.current && dragPoint.current) {
      const point =
        event instanceof MouseEvent
          ? {
              x: event.clientX,
              y: event.clientY,
            }
          : {
              x: event.changedTouches[0].clientX,
              y: event.changedTouches[0].clientY,
            };
      rootEl.current.scrollLeft += dragPoint.current.x - point.x;
      rootEl.current.scrollTop += dragPoint.current.y - point.y;
      dragPoint.current = point;
    }
  }

  function handleDragEnd(event: PointerEvent<HTMLDivElement>) {
    if (boardEl.current) {
      dragPoint.current = undefined;
      if (event.pointerType !== "touch") {
        boardEl.current.removeEventListener("mousemove", handleMove);
      }
    }
  }

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleDragEnd,
    onTouchStart: handleTouchStart,
    onTouchMove: handleMove,
    onTouchEnd: handleDragEnd,
  };
}
