import { PointerEvent, RefObject, TouchEvent, useRef } from "react";

import { IPoint } from "../CameraControls/CameraControls";

export function useCameraDrag(rootEl: RefObject<HTMLDivElement>, boardEl: RefObject<HTMLDivElement>) {
  const dragPoint = useRef<IPoint>();

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (boardEl.current && event.button === 0 && !dragPoint.current) {
      dragPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
      boardEl.current.addEventListener("mousemove", handleMove);
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

  function handlePointerUp() {
    if (boardEl.current) {
      dragPoint.current = undefined;
      boardEl.current.removeEventListener("mousemove", handleMove);
    }
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onTouchMove: handleMove,
  }
}
