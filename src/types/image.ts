import type { IBlock } from "./block";

export interface IImage extends HTMLImageElement {
  block: IBlock;
}
