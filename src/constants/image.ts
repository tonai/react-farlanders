import type { IBlock } from "../types/block";
import type { IImage } from "../types/image";

export function loadImage(block: IBlock): Promise<IImage> {
  return new Promise((resolve, reject) => {
    const image = new Image() as IImage;
    image.onload = () => resolve(image);
    image.onerror = () => reject(image);
    image.src = block.images;
    image.block = block;
  });
}
