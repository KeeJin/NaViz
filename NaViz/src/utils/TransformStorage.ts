import { Matrix4, Vector3, Quaternion } from "three";

// Map to store transforms
const tfTree = new Map<string, Matrix4>();
const tfNames = new Set<string>();

/**
 * Stores a transform in the tfTree.
 * @param parentFrame Parent frame of the transform.
 * @param childFrame Child frame of the transform.
 * @param translation Translation vector [x, y, z].
 * @param rotation Quaternion [x, y, z, w].
 */
const saveTransform = (
  parentFrame: string,
  childFrame: string,
  translation: [number, number, number],
  rotation: [number, number, number, number],
) => {
  const key = `${parentFrame}:${childFrame}`;
  // console.log("Saving transform:", key);
  const transformMatrix = new Matrix4();

  // Create a transformation matrix from translation and quaternion rotation
  const position = new Vector3(...translation);
  const quaternion = new Quaternion(...rotation);
  transformMatrix.compose(position, quaternion, new Vector3(1, 1, 1));

  tfTree.set(key, transformMatrix);
  tfNames.add(childFrame);
  tfNames.add(parentFrame);
};

/**
 * Fetches the transform between two frames.
 * @param fromFrame Child frame.
 * @param toFrame Parent frame.
 * @returns The transformation matrix or null if not found.
 */
const getTransform = (fromFrame: string, toFrame: string): Matrix4 | null => {
  return tfTree.get(`${fromFrame}:${toFrame}`) || null;
};

const getAllTransforms = (): Map<string, Matrix4> => {
  return tfTree;
};

/**
 * Fetches the names of all the transforms.
 * @returns Set of transform names.
 */
const getTransformNames = (): Set<string> => {
  return tfNames;
};

export { saveTransform, getTransform, getAllTransforms, getTransformNames };
