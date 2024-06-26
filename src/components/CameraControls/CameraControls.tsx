import type { IBoardProps } from "../Board/Board";

import { useEffect, useRef } from "react";

import { DEFAULT_ZOOM } from "../../constants/camera";
import { useCameraDrag } from "../../hooks/useCameraDrag";
import { useCameraMove } from "../../hooks/useCameraMove";
import { useCameraWheel } from "../../hooks/useCameraWheel";
import { Axis } from "../../types/camera";
import Board from "../Board/Board";

import "./CameraControls.css";

function CameraControls(props: IBoardProps): JSX.Element {
  const rootEl = useRef<HTMLDivElement>(null);
  const boardEl = useRef<HTMLDivElement>(null);
  const zoom = useRef(DEFAULT_ZOOM);

  useCameraWheel(rootEl, boardEl, zoom);
  const boardCameraProps = useCameraDrag(rootEl, boardEl, zoom);
  const { handleMouseEnter, handleMouseLeave } = useCameraMove(rootEl);

  // Center camera
  useEffect(() => {
    if (rootEl.current) {
      const { height, width } = rootEl.current.getBoundingClientRect();
      rootEl.current.scrollLeft = (rootEl.current.scrollWidth - width) / 2;
      rootEl.current.scrollTop = (rootEl.current.scrollHeight - height) / 2;
    }
  }, []);

  return (
    <div className="CameraControls">
      <div ref={rootEl} className="CameraControls__scroll">
        <div
          className="CameraControls__area"
          {...boardCameraProps}
          ref={boardEl}
        >
          <Board {...props} />
        </div>
      </div>
      <div
        className="CameraControls__top"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: -1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__bottom"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: 1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__left"
        onMouseEnter={() => handleMouseEnter({ [Axis.X]: -1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__right"
        onMouseEnter={() => handleMouseEnter({ [Axis.X]: 1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__topLeft"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: -1, [Axis.X]: -1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__topRight"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: -1, [Axis.X]: 1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__bottomLeft"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: 1, [Axis.X]: -1 })}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className="CameraControls__bottomRight"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: 1, [Axis.X]: 1 })}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}

export default CameraControls;
