import type { IBlock } from "../../types/block";
import type { IImage } from "../../types/image";

import { useEffect, useState } from "react";

import { loadImage } from "../../constants/image";
import landBlocks from "../../data/land-blocks.json";
import Game from "../Game/Game";

function GameLoader(): JSX.Element | null {
  const [loaded, setLoaded] = useState(false);
  const [imageMap, setImageMap] = useState<Map<IBlock, IImage>>(new Map());

  useEffect(() => {
    Promise.all(landBlocks.map((block) => loadImage(block))).then((images) => {
      setImageMap(new Map(images.map((image) => [image.block, image])));
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return <Game imageMap={imageMap} />;
}

export default GameLoader;
