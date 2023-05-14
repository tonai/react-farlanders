import type { RefObject, TouchEvent } from "react";

export function isTouchEvent(
  event: MouseEvent | TouchEvent
): event is TouchEvent {
  return "targetTouches" in event;
}

export function zoomCamera(
  rootEl: RefObject<HTMLDivElement>,
  boardEl: RefObject<HTMLDivElement>,
  prevZoom: number,
  nextZoom: number,
  x: number,
  y: number
): void {
  if (rootEl.current && boardEl.current && prevZoom !== nextZoom) {
    const { scrollLeft, scrollTop } = rootEl.current;
    boardEl.current.style.transform = `scale(${nextZoom})`;
    const factor = nextZoom / prevZoom;
    rootEl.current.scrollLeft = (x + scrollLeft) * factor - x;
    rootEl.current.scrollTop = (y + scrollTop) * factor - y;
  }
}
