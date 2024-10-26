// src/components/Controls.tsx

import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

interface ControlsProps {
  target?: Vector3;
}

const Controls = ({ target = new Vector3(0, 0, 0) }: ControlsProps) => (
  <OrbitControls makeDefault enablePan enableZoom enableRotate target={target} />
);

export default Controls;
