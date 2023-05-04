import {
  PointerEvent as ReactPointerEvent,
  TouchEvent,
  useEffect,
  useRef,
} from "react";

import Board, { IBoardProps } from "../Board/Board";

import "./CameraControls.css";
import { SCROLL_SPEED } from "../../constants/camera";

export interface IPoint {
  x: number;
  y: number;
}

const zooms = [0.5, 0.75, 1, 1.5, 2];
const minZoom = 0;
const maxZoom = zooms.length - 1;
const defaultZoom = zooms.indexOf(1);

function CameraControls(props: IBoardProps) {
  const isMoving = useRef(false);
  const rootEl = useRef<HTMLDivElement>(null);
  const boardEl = useRef<HTMLDivElement>(null);
  const dragPoint = useRef<IPoint>();
  const zoom = useRef(defaultZoom);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
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

  function handleWheel(event: WheelEvent) {
    if (boardEl.current && rootEl.current) {
      const prevZoom = zooms[zoom.current];
      if (event.deltaY > 0) {
        if (zoom.current > minZoom) {
          zoom.current--;
        }
      } else {
        if (zoom.current < maxZoom) {
          zoom.current++;
        }
      }
      const nextZoom = zooms[zoom.current];
      if (prevZoom !== nextZoom) {
        const { scrollLeft, scrollTop } = rootEl.current;
        boardEl.current.style.transform = `scale(${nextZoom})`;
        const factor = nextZoom / prevZoom;
        rootEl.current.scrollLeft =
          (event.clientX + scrollLeft) * factor - event.clientX;
        rootEl.current.scrollTop =
          (event.clientY + scrollTop) * factor - event.clientY;
      }
    }
  }

  function handleEnter(axis: "x" | "y", dir: 1 | -1) {
    isMoving.current = true;
    function move() {
      if (isMoving.current && rootEl.current) {
        if (axis === "x") {
          rootEl.current.scrollLeft += SCROLL_SPEED * dir;
        } else if (axis === "y") {
          rootEl.current.scrollTop += SCROLL_SPEED * dir;
        }
        requestAnimationFrame(move);
      }
    }
    requestAnimationFrame(move);
  }

  function handleLeave() {
    isMoving.current = false;
  }

  useEffect(() => {
    if (rootEl.current) {
      const { height, width } = rootEl.current.getBoundingClientRect();
      rootEl.current.scrollLeft = (rootEl.current.scrollWidth - width) / 2;
      rootEl.current.scrollTop = (rootEl.current.scrollHeight - height) / 2;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="CameraControls">
      <div className="CameraControls__scroll" ref={rootEl}>
        <div
          className="CameraControls__area"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onTouchMove={handleMove}
          ref={boardEl}
        >
          <Board {...props} />
        </div>
      </div>
      <div
        className="CameraControls__top"
        onMouseEnter={() => handleEnter("y", -1)}
        onMouseLeave={handleLeave}
      ></div>
      <div
        className="CameraControls__bottom"
        onMouseEnter={() => handleEnter("y", 1)}
        onMouseLeave={handleLeave}
      ></div>
      <div
        className="CameraControls__left"
        onMouseEnter={() => handleEnter("x", -1)}
        onMouseLeave={handleLeave}
      ></div>
      <div
        className="CameraControls__right"
        onMouseEnter={() => handleEnter("x", 1)}
        onMouseLeave={handleLeave}
      ></div>
    </div>
  );
}

export default CameraControls;
