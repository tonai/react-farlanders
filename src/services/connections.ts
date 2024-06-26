import type { IPoint } from "../types/game";
import type {
  CellType,
  IBoard,
  IBoardBlock,
  IConnectionBoard,
  ISid,
  NonDrawableCellType,
} from "../types/map";

import {
  BLOCK_SIZE,
  REINFORCED_PIPES_SID,
  REINFORCED_POWER_LINES_SID,
  TUNNEL_SID,
} from "../constants/blocks";

import { getCellBlockSid } from "./map";
import { intersect } from "./utils";

export function updateConnections(
  map: IBoard,
  type: CellType,
  connections: IConnectionBoard,
  i: number,
  j: number,
  sids: ISid
): void {
  const cell = map[i][j];
  const cellSids = cell[type];
  if (!cellSids) {
    return;
  }
  connections[i][j] = intersect(cellSids, sids);
  if (connections[i][j]) {
    if (i > 0 && connections[i - 1][j] === null) {
      updateConnections(map, type, connections, i - 1, j, sids);
    }
    if (j > 0 && connections[i][j - 1] === null) {
      updateConnections(map, type, connections, i, j - 1, sids);
    }
    if (i < map.length - 1 && connections[i + 1][j] === null) {
      updateConnections(map, type, connections, i + 1, j, sids);
    }
    if (j < map[0].length - 1 && connections[i][j + 1] === null) {
      updateConnections(map, type, connections, i, j + 1, sids);
    }
  }
}

export function getConnections(
  board: IBoard,
  type: CellType,
  base?: IPoint,
  sids: ISid = TUNNEL_SID
): IConnectionBoard {
  const connections: IConnectionBoard = board.map((row) => row.map(() => null));
  if (base) {
    const { x, y } = base;
    updateConnections(board, type, connections, x, y, sids);
  }
  return connections;
}

export function isConnected(
  connectionBoard: IConnectionBoard,
  i: number,
  j: number
): boolean | null {
  return connectionBoard[i][j];
}

export function drawConnectionPoint(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  connected: boolean | null,
  reinforced: boolean
): void {
  const radius = reinforced ? 10 : 4;
  context.fillStyle = connected ? (reinforced ? "green" : "white") : "red";
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, true);
  context.fill();
}

export function drawConnectionLine(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  connected: boolean | null,
  reinforced: boolean
): void {
  context.lineWidth = reinforced ? 6 : 2;
  context.strokeStyle = connected ? (reinforced ? "green" : "white") : "red";
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

export function isReinforced(sid: number): boolean {
  return sid === REINFORCED_POWER_LINES_SID || sid === REINFORCED_PIPES_SID;
}

export function drawConnections(
  canvas: HTMLCanvasElement,
  board: IBoardBlock,
  type: NonDrawableCellType,
  connections: IConnectionBoard
): void {
  const { height, width } = canvas;
  const context = canvas.getContext("2d");

  if (context) {
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const sid = getCellBlockSid(board[i][j][type]);
        if (sid) {
          const x = j * BLOCK_SIZE + BLOCK_SIZE / 2;
          const y = (i + 1) * BLOCK_SIZE + BLOCK_SIZE / 2;
          const connected = connections[i][j];
          const reinforced = isReinforced(sid);

          if (i < board.length - 1) {
            const sid2 = getCellBlockSid(board[i + 1][j][type]);
            if (sid2) {
              const y2 = y + BLOCK_SIZE;
              const connected = connections[i + 1][j];
              const reinforced2 = reinforced && isReinforced(sid2);
              drawConnectionLine(context, x, y, x, y2, connected, reinforced2);
            }
          }

          if (j < board[0].length - 1) {
            const sid2 = getCellBlockSid(board[i][j + 1][type]);
            if (sid2) {
              const x2 = x + BLOCK_SIZE;
              const connected = connections[i][j + 1];
              const reinforced2 = reinforced && isReinforced(sid2);
              drawConnectionLine(context, x, y, x2, y, connected, reinforced2);
            }
          }

          drawConnectionPoint(context, x, y, connected, reinforced);
        }
      }
    }
  }
}
