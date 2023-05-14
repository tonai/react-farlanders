import type { ICameraMoves } from "../types/camera";
import type { RefObject } from "react";

import { useCallback, useEffect, useRef } from "react";

import { SCROLL_SPEED } from "../constants/camera";
import { KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP } from "../constants/keys";
import { Axis } from "../types/camera";

export interface ICameraMoveHook {
  handleMouseEnter: (cameraMove: ICameraMoves) => void;
  handleMouseLeave: () => void;
}

export function useCameraMove(
  rootEl: RefObject<HTMLDivElement>
): ICameraMoveHook {
  const animating = useRef(false);
  const camera = useRef<ICameraMoves>({});

  const move = useCallback(() => {
    const entries = Object.entries(camera.current);
    if (entries.length > 0) {
      entries.forEach(([axis, dir]) => {
        if (axis === Axis.X && rootEl.current) {
          rootEl.current.scrollLeft += SCROLL_SPEED * dir;
        } else if (axis === Axis.Y && rootEl.current) {
          rootEl.current.scrollTop += SCROLL_SPEED * dir;
        }
      });
      requestAnimationFrame(move);
    } else {
      animating.current = false;
    }
  }, [rootEl]);

  function handleMouseEnter(cameraMove: ICameraMoves): void {
    camera.current = cameraMove;
    if (!animating.current) {
      animating.current = true;
      requestAnimationFrame(move);
    }
  }

  function handleMouseLeave(): void {
    camera.current = {};
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (!event.repeat) {
        switch (event.code) {
          case KEY_UP:
            camera.current[Axis.Y] = -1;
            break;

          case KEY_DOWN:
            camera.current[Axis.Y] = 1;
            break;

          case KEY_LEFT:
            camera.current[Axis.X] = -1;
            break;

          case KEY_RIGHT:
            camera.current[Axis.X] = 1;
            break;
        }
        if (!animating.current) {
          animating.current = true;
          requestAnimationFrame(move);
        }
      }
    }

    function handleKeyUp(event: KeyboardEvent): void {
      switch (event.code) {
        case KEY_UP:
          if (camera.current[Axis.Y] === -1) {
            delete camera.current[Axis.Y];
          }
          break;

        case KEY_DOWN:
          if (camera.current[Axis.Y] === 1) {
            delete camera.current[Axis.Y];
          }
          break;

        case KEY_LEFT:
          if (camera.current[Axis.X] === -1) {
            delete camera.current[Axis.X];
          }
          break;

        case KEY_RIGHT:
          if (camera.current[Axis.X] === 1) {
            delete camera.current[Axis.X];
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [move]);

  return { handleMouseEnter, handleMouseLeave };
}
