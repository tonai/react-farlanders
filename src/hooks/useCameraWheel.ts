import { MutableRefObject, RefObject, useEffect } from "react";

import { MAX_ZOOM, MIN_ZOOM, ZOOMS } from "../constants/camera";
import { zoomCamera } from "../services/camera";

export function useCameraWheel(rootEl: RefObject<HTMLDivElement>, boardEl: RefObject<HTMLDivElement>, zoom: MutableRefObject<number>) {
  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (boardEl.current && rootEl.current) {
        const prevZoom = ZOOMS[zoom.current];
        if (event.deltaY > 0) {
          if (zoom.current > MIN_ZOOM) {
            zoom.current--;
          }
        } else {
          if (zoom.current < MAX_ZOOM) {
            zoom.current++;
          }
        }
        const nextZoom = ZOOMS[zoom.current];
        zoomCamera(rootEl, boardEl, prevZoom, nextZoom, event.clientX, event.clientY);
        // if (prevZoom !== nextZoom) {
        //   const { scrollLeft, scrollTop } = rootEl.current;
        //   boardEl.current.style.transform = `scale(${nextZoom})`;
        //   const factor = nextZoom / prevZoom;
        //   rootEl.current.scrollLeft =
        //     (event.clientX + scrollLeft) * factor - event.clientX;
        //   rootEl.current.scrollTop =
        //     (event.clientY + scrollTop) * factor - event.clientY;
        // }
      }
    }

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [boardEl, rootEl, zoom]);
}
