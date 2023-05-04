import { useEffect, useState } from "react";

import { loadImage } from "../../constants/image";
import landBlocks from "../../data/land-blocks.json";
import { IImage } from "../../types/image";
import { IBlock } from "../../types/block";

import Game from "../Game/Game";

function GameLoader() {
  const [loaded, setLoaded] = useState(false);
  const [imageMap, setImageMAp] = useState<Map<IBlock, IImage>>(new Map());

  useEffect(() => {
    Promise.all(landBlocks.map((block) => loadImage(block))).then((images) => {
      setImageMAp(new Map(images.map((image) => [image.block, image])));
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return <Game imageMap={imageMap} />;
}

export default GameLoader;
