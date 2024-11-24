// src/components/Controls.tsx

import { OrbitControls } from "@react-three/drei";
import { Camera, Vector3 } from "three";

interface ControlsProps {
  target?: Vector3;
  camera?: Camera | undefined;
}

const Controls = ({
  target = new Vector3(0, 0, 0),
  camera = undefined,
}: ControlsProps) =>
  camera ? (
    <OrbitControls
      makeDefault
      enablePan
      enableZoom
      enableRotate
      target={target}
      camera={camera}
    />
  ) : (
    <OrbitControls
      makeDefault
      enablePan
      enableZoom
      enableRotate
      target={target}
    />
  );

export default Controls;
