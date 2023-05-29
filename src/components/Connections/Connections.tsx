import { useContext, useEffect, useRef } from "react";

import { gameContext } from "../../contexts/game";
import { drawConnections } from "../../services/connections";
import { View } from "../../types/game";
import { NonDrawableCellType } from "../../types/map";

import "./Connections.css";

interface IProps {
  height: number;
  level: number;
  width: number;
}

function Connections(props: IProps): JSX.Element {
  const { height, level, width } = props;
  const { map, power, view, water } = useContext(gameContext);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      if (view === View.Power) {
        drawConnections(
          canvas.current,
          map[level],
          NonDrawableCellType.Power,
          power
        );
      } else if (view === View.Water) {
        drawConnections(
          canvas.current,
          map[level],
          NonDrawableCellType.Water,
          water
        );
      }
    }
  }, [canvas, level, map, power, view, water]);

  return (
    <canvas
      ref={canvas}
      className="Connections"
      height={height}
      width={width}
    />
  );
}

export default Connections;
