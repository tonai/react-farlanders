import type { MutableRefObject, RefObject } from "react";

import { useEffect } from "react";

import { MAX_ZOOM, MIN_ZOOM, ZOOMS } from "../constants/camera";
import { zoomCamera } from "../services/camera";

export function useCameraWheel(
  rootEl: RefObject<HTMLDivElement>,
  boardEl: RefObject<HTMLDivElement>,
  zoom: MutableRefObject<number>
): void {
  useEffect(() => {
    function handleWheel(event: WheelEvent): void {
      if (boardEl.current && rootEl.current) {
        const prevZoom = ZOOMS[zoom.current];
        if (event.deltaY > 0) {
          if (zoom.current > MIN_ZOOM) {
            zoom.current--;
          }
        } else if (zoom.current < MAX_ZOOM) {
          zoom.current++;
        }
        const nextZoom = ZOOMS[zoom.current];
        zoomCamera(
          rootEl,
          boardEl,
          prevZoom,
          nextZoom,
          event.clientX,
          event.clientY
        );
      }
    }

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [boardEl, rootEl, zoom]);
}
