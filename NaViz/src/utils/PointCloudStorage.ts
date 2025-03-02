import { Queue } from "queue-typescript";

const pointCloudMapQueue = new Map<string, Queue<any>>();

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
  if (queueSize >= 10) {
    console.log("Queue size:", queueSize);
    console.log("Queue size exceeded for topic:", topicName);
    console.log("Dequeuing the oldest point cloud message.");
    pointCloudMapQueue.get(topicName)?.dequeue();
  }
  pointCloudMapQueue.get(topicName)?.enqueue(pointCloud);
};

/**
 * Fetches the point cloud message from the queue.
 * @param topicName Topic name.
 * @returns The point cloud message or null if not found.
 */
const getPointCloud = (topicName: string): any | null => {
  if (!pointCloudMapQueue.has(topicName)) {
    return null;
  }
  return pointCloudMapQueue.get(topicName)?.dequeue() || null;
};

export { savePointCloud, getPointCloud };
