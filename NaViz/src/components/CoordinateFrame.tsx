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
  onPoseChange?: (position: Vector3, rotation: Euler) => void;
}
const CoordinateFrame = ({
  showGrid = false,
  onPoseChange = undefined,
}: CoordinateFrameProps) => {
  const groupRef = useRef<Group>(null);

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

  // State to track the previous position and rotation
  const prevPose = useRef<{ position: Vector3; rotation: Euler } | null>(null);

  // Use frame to track changes every frame
  useFrame(() => {
    if (groupRef.current && onPoseChange !== undefined) {
      const { position, rotation } = groupRef.current;

      // Check if position or rotation has changed
      const hasChanged =
        !prevPose.current ||
        !prevPose.current.position.equals(position) ||
        !prevPose.current.rotation.equals(rotation);

      if (hasChanged) {
        // console.log("Pose changed");
        // Update the previous pose reference
        prevPose.current = {
          position: position.clone(),
          rotation: rotation.clone(),
        };

        // console.log("Position: ", position);
        // console.log("Rotation: ", rotation);

        // Call the onPoseChange callback with the current position and rotation
        onPoseChange(position.clone(), rotation.clone());
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
