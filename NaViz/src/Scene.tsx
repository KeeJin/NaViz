import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import CoordinateFrame from "./components/CoordinateFrame";
import Controls from "./components/Controls";
import { getPointCloud } from "./utils/PointCloudStorage";
import { getTransform, getTransformNames } from "./utils/TransformStorage";
import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import {
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
  Points,
} from "@react-three/drei";

interface Pose {
  position: Vector3;
  rotation: Euler;
}

const Scene = ({
  priorMap,
  subscribedTopics,
}: {
  priorMap: Object3D | undefined;
  subscribedTopics: Map<string, string>;
}) => {
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const [showTf, setShowTf] = useState<boolean>(false);
  const [showPointCloud, setShowPointCloud] = useState<boolean>(false);
  const [baseLink, setBaseLink] = useState<Pose | null>(null);
  const [pointClouds, setPointClouds] = useState<string[]>([]);

  useEffect(() => {
    console.log("Subscribed Topics:", subscribedTopics);
    setShowTf(subscribedTopics.has("/tf"));

    if (!showTf) {
      return;
    }

    let hasPointCloudMessage = false;
    let pointCloudTopics: string[] = [];
    subscribedTopics.forEach((messageType, topicName) => {
      console.log("Topic Name:", topicName);
      if (messageType == "sensor_msgs/msg/PointCloud2") {
        hasPointCloudMessage = true;
        pointCloudTopics.push(topicName);
      }
    });
    console.log("Point Cloud Topics:", pointCloudTopics);
    console.log("Has Point Cloud Message?:", hasPointCloudMessage);
    setPointClouds(pointCloudTopics);
    setShowPointCloud(hasPointCloudMessage);
  }, [subscribedTopics]);

  useEffect(() => {
    const getBaseLinkPose = () => {
      const baseFPTransform = getTransform("odom", "base_footprint");
      const baseLinkTransform = getTransform("base_footprint", "base_link");
      let baseLinkPose = new Matrix4();
      if (baseFPTransform && baseLinkTransform) {
        baseLinkPose = baseFPTransform.multiply(baseLinkTransform);
      } else {
        console.error("Base Footprint or Base Link not found.");
        return;
      }
      if (baseLinkPose) {
        const position = new Vector3();
        const quaternion = new Quaternion();
        baseLinkPose.decompose(position, quaternion, new Vector3());
        const rotation = new Euler().setFromQuaternion(quaternion);
        // console.log("Base Link Pose:", position, rotation);
        setBaseLink({ position, rotation });
      } else {
        // console.log("Base Link not found.");
      }
    };
    const interval = setInterval(() => {
      getBaseLinkPose();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // const showTfs = () => {
  //   console.log("Show TF:", showTf);
  //   if (!showTf) {
  //     return null;
  //   }

  //   getTransformNames().forEach((frame) => {
  //     let map_to_base_trans = new Vector3();
  //     let map_to_base_rot = new Euler();
  //     console.log("Frame:", frame);
  //     // const map_to_base_link
  //     if (frame === "base_link") {
  //       const map_to_base_link = getTransform("map", frame);
  //       const rotation = new Quaternion();
  //       map_to_base_link?.decompose(map_to_base_trans, rotation, new Vector3());
  //       map_to_base_rot = new Euler().setFromQuaternion(rotation);
  //       console.log("translation:", map_to_base_trans);
  //       console.log("rotation:", map_to_base_rot);
  //     }
  //     return (
  //       <group>
  //         <CoordinateFrame
  //           showGrid={false}
  //           translation={baseLink?.position || new Vector3(0, 0, 0)}
  //           rotation={baseLink?.rotation || new Euler(0, 0, 0)}
  //         />
  //       </group>
  //     );
  //   });
  // };

  return (
    <div className="bg-black h-full w-full">
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 10]} // Adjust position (x, y, z)
          rotation={[0, 0, 0]} // Rotate the camera (x, y, z) in radians
          near={0.05}
          far={8000}
          up={[0, 0, 1]}
        />
        <ambientLight intensity={0.5} />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <CoordinateFrame
          showGrid={true}
          translation={new Vector3(0, 0, 0)}
          rotation={new Euler(0, 0, 0)}
          onPoseChange={(position) => {
            // Update position state
            console.log("position changed: ", position);
            setPosition(position);
          }}
        />

        {/* {showTfs()} */}
        {showTf ? <CoordinateFrame
            showGrid={false}
            translation={baseLink?.position || new Vector3(0, 0, 0)}
            rotation={baseLink?.rotation || new Euler(0, 0, 0)}
          /> : null}

        <Points>{priorMap ? <primitive object={priorMap} /> : null}</Points>

        {showPointCloud
          ? <Points>
                  <primitive object={getPointCloud("/velodyne_points")} />
            </Points>
          : null}

        <Controls target={position ? position : new Vector3(0, 0, 0)} />
        <GizmoHelper
          alignment="bottom-right" // widget alignment within scene
          margin={[80, 80]} // widget margins (X, Y)
        >
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="white"
            labels={["x", "y", "z"]}
          />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
      </Canvas>
    </div>
  );
};

export default Scene;
