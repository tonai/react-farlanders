import { RefObject, useEffect, useRef } from "react";

const zooms = [0.5, 0.75, 1, 1.5, 2];
const minZoom = 0;
const maxZoom = zooms.length - 1;
const defaultZoom = zooms.indexOf(1);


export function useCameraWheel(rootEl: RefObject<HTMLDivElement>, boardEl: RefObject<HTMLDivElement>) {
  const zoom = useRef(defaultZoom);

  useEffect(() => {
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

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [boardEl, rootEl]);
}
