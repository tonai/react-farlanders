import type { IImage } from "../../types/image";

import { useEffect, useState } from "react";

import { blocks } from "../../constants/blocks";
import { loadImage } from "../../services/image";
import Game from "../Game/Game";

function GameLoader(): JSX.Element | null {
  const [loaded, setLoaded] = useState(false);
  const [imageMap, setImageMap] = useState<Map<number, IImage>>(new Map());

  useEffect(() => {
    Promise.all(blocks.map((block) => loadImage(block))).then((images) => {
      setImageMap(new Map(images.map((image) => [image.block.sid, image])));
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return <Game imageMap={imageMap} />;
}

export default GameLoader;
