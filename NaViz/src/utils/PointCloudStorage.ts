import { Queue } from "queue-typescript";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Matrix4,
  NormalBufferAttributes,
  Object3D,
  Object3DEventMap,
  Points,
  PointsMaterial,
  Vector3,
} from "three";
import { getTransform } from "./TransformStorage";

const pointCloudMapQueue = new Map<string, Queue<Object3D>>();

/**
 * Stores a point cloud message in the pointCloudMapQueue.
 * @param topicName Topic name.
 * @param pointCloud Point cloud.
 */
const savePointCloud = (topicName: string, pointCloud: any) => {
  if (!pointCloudMapQueue.has(topicName)) {
    console.log("Creating a new queue for topic:", topicName);
    pointCloudMapQueue.set(topicName, new Queue());
  }

  // Limit the queue size to 10
  // TODO: Make the queue size configurable
  const queueSize = pointCloudMapQueue.get(topicName)?.length || 0;
  console.log("Queue size:", queueSize);
  if (queueSize >= 10) {
    // console.log("Queue size exceeded for topic:", topicName);
    // console.log("Dequeuing the oldest point cloud message.");
    pointCloudMapQueue.get(topicName)?.dequeue();
  }

  // Convert the point cloud message to a Three.js Object3D
  // and store it in the queue
  const positions: number[] = [];
  const colors: number[] = [];
  // console.log("pointcloud msg:", pointCloud);
  const { data, point_step, fields, is_bigendian, width } = pointCloud;
  // Convert data string into a Uint8Array (if it's a string)
  let uint8Array;
  if (typeof data === "string") {
    const binaryData = atob(data); // Decode Base64 (if applicable)
    uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
  } else {
    uint8Array = new Uint8Array(data);
  }
  const dataView = new DataView(uint8Array.buffer);

  if (uint8Array.byteLength !== width * point_step) {
    console.error("Mismatch in expected point cloud data size!");
    return null;
  }

  // Get field offsets
  const fieldMap: Record<string, number | undefined> = Object.fromEntries(
    fields.map((f: any) => [f.name, f.offset]),
  );

  const xOffset = fieldMap["x"] ?? -1;
  const yOffset = fieldMap["y"] ?? -1;
  const zOffset = fieldMap["z"] ?? -1;
  const intensityOffset = fieldMap["intensity"] ?? -1;

  if (xOffset < 0 || yOffset < 0 || zOffset < 0) {
    console.error("Missing required fields (x, y, z)");
    return null;
  }

  const littleEndian = !is_bigendian;

  // Iterate through each point
  for (let i = 0; i < uint8Array.byteLength; i += point_step) {
    if (i + xOffset + 4 > dataView.byteLength) break;

    const x = dataView.getFloat32(i + xOffset, littleEndian);
    const y = dataView.getFloat32(i + yOffset, littleEndian);
    const z = dataView.getFloat32(i + zOffset, littleEndian);

    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      positions.push(x, y, z);

      let intensity = 0;
      if (
        intensityOffset >= 0 &&
        i + intensityOffset + 4 <= dataView.byteLength
      ) {
        intensity = dataView.getFloat32(i + intensityOffset, littleEndian);
      }

      // Normalize intensity to [0,1] and use as grayscale color
      const colorValue = Math.min(intensity / 255, 1);
      colors.push(colorValue, colorValue, colorValue);
    }
  }

  const transformedPositions: number[] = [];
  const baseFPTransform = getTransform("odom", "base_footprint");
  const baseLinkTransform = getTransform("base_footprint", "base_link");
  const lidarTransform = getTransform("base_link", "velodyne");
  let baseLinkPose = new Matrix4();
  if (baseFPTransform && baseLinkTransform && lidarTransform) {
    baseLinkPose = baseFPTransform
      .multiply(baseLinkTransform)
      .multiply(lidarTransform);
  } else {
    console.error("Base Footprint or Base Link or Lidar not found.");
    console.error("baseFPTransform:", baseFPTransform);
    console.error("baseLinkTransform:", baseLinkTransform);
    console.error("lidarTransform:", lidarTransform);
    return null;
  }

  // Transform and sample points
  for (let i = 0; i < positions.length; i += 6) {
    const point = new Vector3(positions[i], positions[i + 1], positions[i + 2]);
    point.applyMatrix4(baseLinkPose); // Apply transformation
    transformedPositions.push(point.x, point.y, point.z);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(transformedPositions, 3),
  );
  // geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  const material = new PointsMaterial({ size: 0.05, color: Color.NAMES.beige });
  const points = new Points<
    BufferGeometry<NormalBufferAttributes>,
    PointsMaterial
  >(geometry, material);
  console.log("storing pc for topic: ", topicName);
  pointCloudMapQueue.get(topicName)?.enqueue(points);
};

/**
 * Fetches the point cloud message from the queue.
 * @param topicName Topic name.
 * @returns The point cloud message or null if not found.
 */
const getPointCloud = (topicName: string): Object3D<Object3DEventMap> => {
  if (!pointCloudMapQueue.has(topicName)) {
    console.error("Failed to get point cloud of topic: ", topicName);
    return new Object3D<Object3DEventMap>();
  }
  let pointCloud = pointCloudMapQueue.get(topicName)?.front;
  if (pointCloudMapQueue.get(topicName)?.length === 1) {
  } else {
    pointCloudMapQueue.get(topicName)?.dequeue();
  }
  console.log("length remaining: ", pointCloudMapQueue.get(topicName)?.length);
  if (!pointCloud) {
    console.error("Failed to get point cloud of topic: ", topicName);
    return new Object3D<Object3DEventMap>();
  }
  return pointCloud;
};

export { savePointCloud, getPointCloud };
