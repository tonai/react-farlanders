import { useEffect, useRef } from "react";

import { Axis } from "../../types/camera";

import Board, { IBoardProps } from "../Board/Board";
import { useCameraDrag } from "../hooks/useCameraDrag";
import { useCameraWheel } from "../hooks/useCameraWheel";

import "./CameraControls.css";
import { useCameraMove } from "../hooks/useCameraMove";

export interface IPoint {
  x: number;
  y: number;
}

function CameraControls(props: IBoardProps) {
  const rootEl = useRef<HTMLDivElement>(null);
  const boardEl = useRef<HTMLDivElement>(null);

  useCameraWheel(rootEl, boardEl);
  const boardCameraProps = useCameraDrag(rootEl, boardEl);
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
      <div className="CameraControls__scroll" ref={rootEl}>
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
      ></div>
      <div
        className="CameraControls__bottom"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: 1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className="CameraControls__left"
        onMouseEnter={() => handleMouseEnter({ [Axis.X]: -1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className="CameraControls__right"
        onMouseEnter={() => handleMouseEnter({ [Axis.X]: 1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className="CameraControls__topLeft"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: -1, [Axis.X]: -1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className="CameraControls__topRight"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: -1, [Axis.X]: 1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className="CameraControls__bottomLeft"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: 1, [Axis.X]: -1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className="CameraControls__bottomRight"
        onMouseEnter={() => handleMouseEnter({ [Axis.Y]: 1, [Axis.X]: 1 })}
        onMouseLeave={handleMouseLeave}
      ></div>
    </div>
  );
}

export default CameraControls;
