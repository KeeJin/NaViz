// src/hooks/usePCDParser.ts

import { useState, useCallback } from "react";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { Object3D } from "three";

const usePCDParser = () => {
  const [points, setPoints] = useState<Object3D>();

  const parsePCD = useCallback((fileContent: ArrayBuffer) => {
    const loader = new PCDLoader();
    const data = loader.parse(fileContent);
    setPoints(data);
  }, []);

  return { points, parsePCD };
};

export default usePCDParser;
