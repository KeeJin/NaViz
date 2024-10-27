import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import CoordinateFrame from "./components/CoordinateFrame";
import Controls from "./components/Controls";
import { Object3D, Vector3 } from "three";
import {
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
  Points,
} from "@react-three/drei";

const Scene = ({ priorMap }: { priorMap: Object3D | undefined }) => {
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  return (
    <div className="bg-black h-full w-full">
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 10]} // Adjust position (x, y, z)
          rotation={[-Math.PI / 4, 0, 0]} // Rotate the camera (x, y, z) in radians
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CoordinateFrame
          showGrid={true}
          onPoseChange={(position) => {
            // Update position state
            console.log("position changed: ", position);
            setPosition(position);
          }}
        />

        <Points>{priorMap ? <primitive object={priorMap} /> : null}</Points>

        <Controls target={position ? position : new Vector3(0, 0, 0)} />
        <GizmoHelper
          alignment="bottom-right" // widget alignment within scene
          margin={[80, 80]} // widget margins (X, Y)
        >
          <GizmoViewport
            axisColors={["red", "blue", "green"]}
            labelColor="black"
            labels={["x", "z", "y"]}
          />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
      </Canvas>
    </div>
  );
};

export default Scene;
