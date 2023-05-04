import { PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";

import Board, { IBoardProps } from "../Board/Board";

import "./CameraControls.css";

export interface IPoint {
  x: number;
  y: number;
}

const zooms = [0.5, 0.75, 1, 1.5, 2];
const minZoom = 0;
const maxZoom = zooms.length - 1;
const defaultZoom = zooms.indexOf(1);

// export interface IBoardControlsProps extends IBoardProps {}

function CameraControls(props: IBoardProps) {
  const rootEl = useRef<HTMLDivElement>(null);
  const boardEl = useRef<HTMLDivElement>(null);
  const dragPoint = useRef<IPoint>();
  const zoom = useRef(defaultZoom);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (boardEl.current) {
      dragPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
      boardEl.current.addEventListener("pointermove", handlePointerMove);
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (rootEl.current && dragPoint.current) {
      rootEl.current.scrollLeft += dragPoint.current.x - event.clientX;
      rootEl.current.scrollTop += dragPoint.current.y - event.clientY;
      dragPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  function handlePointerUp() {
    if (boardEl.current) {
      dragPoint.current = undefined;
      boardEl.current.removeEventListener("pointermove", handlePointerMove);
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
        const { scrollLeft, scrollTop } = rootEl.current
        boardEl.current.style.transform = `scale(${nextZoom})`;
        const factor = nextZoom / prevZoom;
        rootEl.current.scrollLeft = (event.clientX + scrollLeft) * factor - event.clientX;
        rootEl.current.scrollTop = (event.clientY + scrollTop) * factor - event.clientY;
      }
    }
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
    <div className="CameraControls" ref={rootEl}>
      <div
        className="CameraControls__area"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        ref={boardEl}
      >
        <Board {...props} />
      </div>
    </div>
  );
}

export default CameraControls;
