import type { ISid } from "../types/map";

export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function intersect(cellSids?: ISid, sids?: ISid): boolean {
  if (!cellSids || !sids) {
    return false;
  }
  if (cellSids instanceof Array) {
    if (sids instanceof Array) {
      return cellSids.some((sid) => sids.includes(sid));
    }
    return cellSids.includes(sids);
  }
  if (sids instanceof Array) {
    return sids.includes(cellSids);
  }
  return cellSids === sids;
}
