import type { IPoint } from "../types/game";
import type {
  MutableRefObject,
  MouseEvent as ReactMouseEvent,
  RefObject,
  TouchEvent,
} from "react";

import { useRef } from "react";

import { MAX_ZOOM, MIN_ZOOM, ZOOMS, ZOOM_DISTANCE } from "../constants/camera";
import { isTouchEvent, zoomCamera } from "../services/camera";
import { getDistance } from "../services/utils";

export interface ICameraDragHook {
  onClickCapture: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: MouseEvent | TouchEvent<HTMLDivElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
}

export function useCameraDrag(
  rootEl: RefObject<HTMLDivElement>,
  boardEl: RefObject<HTMLDivElement>,
  zoom: MutableRefObject<number>
): ICameraDragHook {
  const dragPoint = useRef<IPoint>();
  const touchPoints = useRef<Map<number, IPoint>>(new Map());
  const cancelClick = useRef(false);

  function handleMove(event: MouseEvent | TouchEvent<HTMLDivElement>): void {
    if (rootEl.current && dragPoint.current && touchPoints.current.size < 2) {
      // Drag (move)
      cancelClick.current = true;
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
    } else if (
      touchPoints.current.size === 2 &&
      isTouchEvent(event) &&
      event.targetTouches.length === 2
    ) {
      // Pich (zoom)
      cancelClick.current = true;
      const startPoints = [...touchPoints.current.values()];
      const startDistance = getDistance(
        startPoints[0].x,
        startPoints[0].y,
        startPoints[1].x,
        startPoints[1].y
      );
      const distance = getDistance(
        event.targetTouches[0].clientX,
        event.targetTouches[0].clientY,
        event.targetTouches[1].clientX,
        event.targetTouches[1].clientY
      );
      const prevZoom = ZOOMS[zoom.current];
      if (startDistance - distance > ZOOM_DISTANCE && zoom.current > MIN_ZOOM) {
        zoom.current--;
      } else if (
        distance - startDistance > ZOOM_DISTANCE &&
        zoom.current < MAX_ZOOM
      ) {
        zoom.current++;
      }
      const nextZoom = ZOOMS[zoom.current];
      if (rootEl.current && boardEl.current && prevZoom !== nextZoom) {
        touchPoints.current.set(event.targetTouches[0].identifier, {
          x: event.targetTouches[0].clientX,
          y: event.targetTouches[0].clientY,
        });
        touchPoints.current.set(event.targetTouches[1].identifier, {
          x: event.targetTouches[1].clientX,
          y: event.targetTouches[1].clientY,
        });
        zoomCamera(
          rootEl,
          boardEl,
          prevZoom,
          nextZoom,
          (event.targetTouches[0].clientX + event.targetTouches[1].clientX) / 2,
          (event.targetTouches[0].clientY + event.targetTouches[1].clientY) / 2
        );
      }
    }
  }

  function handleMouseDown(event: ReactMouseEvent<HTMLDivElement>): void {
    if (boardEl.current && event.button === 0 && !dragPoint.current) {
      cancelClick.current = false;
      dragPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
      boardEl.current.addEventListener("mousemove", handleMove);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>): void {
    if (boardEl.current) {
      cancelClick.current = false;
      const point = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
      touchPoints.current.set(event.changedTouches[0].identifier, point);
      if (!dragPoint.current) {
        dragPoint.current = point;
      }
    }
  }

  function handleMouseUp(): void {
    if (boardEl.current) {
      dragPoint.current = undefined;
      boardEl.current.removeEventListener("mousemove", handleMove);
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>): void {
    if (boardEl.current) {
      dragPoint.current = undefined;
      touchPoints.current.delete(event.changedTouches[0].identifier);
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    if (cancelClick.current) {
      event.stopPropagation();
    }
  }

  return {
    onClickCapture: handleClick,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleMove,
    onTouchStart: handleTouchStart,
  };
}
