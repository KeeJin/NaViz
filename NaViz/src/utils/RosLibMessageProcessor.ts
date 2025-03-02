import { saveTransform } from "./TransformStorage";
import { savePointCloud } from "./PointCloudStorage";

const handleTfMessage = (message: any) => {
  // console.log("TF Message:", message);
  // TODO: Ignore if timestamp is too old
  for (const transform of message.transforms) {
    const parentFrame = transform.header.frame_id;
    const childFrame = transform.child_frame_id;
    const translation = [
      transform.transform.translation.x,
      transform.transform.translation.y,
      transform.transform.translation.z,
    ] as [number, number, number];
    const rotation = [
      transform.transform.rotation.x,
      transform.transform.rotation.y,
      transform.transform.rotation.z,
      transform.transform.rotation.w,
    ] as [number, number, number, number];
    saveTransform(parentFrame, childFrame, translation, rotation);
  }
};

const handlePointCloud2Message = (topicName: string, message: any) => {
  savePointCloud(topicName, message);
};

export { handleTfMessage, handlePointCloud2Message };
