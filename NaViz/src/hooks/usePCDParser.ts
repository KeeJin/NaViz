// src/hooks/usePCDParser.ts

import { useState, useCallback } from "react";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { Color, Object3D, PointsMaterial } from "three";

const usePCDParser = () => {
  const [points, setPoints] = useState<Object3D>();

  const parsePCD = useCallback((fileContent: ArrayBuffer) => {
    const loader = new PCDLoader();
    const data = loader.parse(fileContent);
    console.log("Number of points: ", data.geometry.attributes.position.count);
    data.material = new PointsMaterial({
      size: 0.05,
      color: Color.NAMES.violet,
    });
    // Todo: Figure out how to create a shader material to color points based on z-coordinate

    setPoints(data);
  }, []);

  return { points, parsePCD };
};

export default usePCDParser;
