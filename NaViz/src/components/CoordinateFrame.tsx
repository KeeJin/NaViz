// src/components/CoordinateFrame.tsx

import { useMemo, useRef } from "react";
import { Line, Grid } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Color, Vector3, Euler, Group, DoubleSide } from "three";

const Axis = ({
  color,
  points,
  lineWidth = 1,
}: {
  color: Color | string;
  points: [number, number, number][];
  lineWidth?: number;
}) => <Line points={points} color={color} lineWidth={lineWidth} />;

interface CoordinateFrameProps {
  showGrid?: boolean;
  translation: Vector3;
  rotation: Euler;
  onPoseChange?: (position: Vector3, rotation: Euler) => void;
}
const CoordinateFrame = ({
  showGrid = false,
  translation = new Vector3(0, 0, 0),
  rotation = new Euler(0, 0, 0),
  onPoseChange = undefined,
}: CoordinateFrameProps) => {
  const groupRef = useRef<Group>(null);
  const prevPose = useRef<{ position: Vector3; rotation: Euler } | null>(null);

  // Define points for each axis
  const xPoints = useMemo(
    () =>
      [
        [0, 0, 0],
        [1, 0, 0],
      ] as [number, number, number][],
    [],
  );
  const yPoints = useMemo(
    () =>
      [
        [0, 0, 0],
        [0, 1, 0],
      ] as [number, number, number][],
    [],
  );
  const zPoints = useMemo(
    () =>
      [
        [0, 0, 0],
        [0, 0, 1],
      ] as [number, number, number][],
    [],
  );

  // Use frame to track changes every frame
  useFrame(() => {
    if (groupRef.current) {
      // Update translation and rotation
      groupRef.current.position.copy(translation);
      groupRef.current.rotation.copy(rotation);

      // Check if pose has changed before triggering callback
      if (
        !prevPose.current ||
        !prevPose.current.position.equals(translation) ||
        !prevPose.current.rotation.equals(rotation)
      ) {
        prevPose.current = {
          position: translation.clone(),
          rotation: rotation.clone(),
        };

        onPoseChange?.(translation.clone(), rotation.clone());
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Axis color="red" points={xPoints} lineWidth={7} />
      <Axis color="green" points={yPoints} lineWidth={7} />
      <Axis color="blue" points={zPoints} lineWidth={7} />

      {showGrid && (
        <Grid
          args={[100, 100]} // Grid size and divisions
          sectionSize={10} // Size of each grid section
          position={[0, 0, 0]} // Slightly offset on the Y-axis to prevent z-fighting
          rotation={[Math.PI / 2, 0, 0]} // Rotate the grid to be horizontal
          infiniteGrid={false} // Make the grid infinite
          side={DoubleSide} // Render the grid on both sides
          //   fadeDistance={10} // Distance at which the grid fades
          cellThickness={0.3} // Thickness of the grid lines
        />
      )}
    </group>
  );
};

export default CoordinateFrame;
