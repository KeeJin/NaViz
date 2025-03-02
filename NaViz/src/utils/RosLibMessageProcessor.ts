import { saveTransform } from "./TransformStorage";
import { savePointCloud } from "./PointCloudStorage";

const handleTfMessage = (message: any) => {
  // console.log("TF Message:", message);
  // TODO: Ignore if timestamp is too old

  const parentFrame = message.transforms[0].header.frame_id;
  const childFrame = message.transforms[0].child_frame_id;
  const translation = [
    message.transforms[0].transform.translation.x,
    message.transforms[0].transform.translation.y,
    message.transforms[0].transform.translation.z,
  ] as [number, number, number];
  const rotation = [
    message.transforms[0].transform.rotation.x,
    message.transforms[0].transform.rotation.y,
    message.transforms[0].transform.rotation.z,
    message.transforms[0].transform.rotation.w,
  ] as [number, number, number, number];
  saveTransform(parentFrame, childFrame, translation, rotation);
};

const handlePointCloud2Message = (topicName: string, message: any) => {
  savePointCloud(topicName, message);
};

export { handleTfMessage, handlePointCloud2Message };
