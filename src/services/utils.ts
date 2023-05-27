import type { ISid } from "../types/map";

export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function intersect(boardItem: ISid, sids: ISid): boolean {
  if (boardItem instanceof Array) {
    if (sids instanceof Array) {
      return boardItem.some((sid) => sids.includes(sid));
    }
    return boardItem.includes(sids);
  }
  if (sids instanceof Array) {
    return sids.includes(boardItem);
  }
  return boardItem === sids;
}
