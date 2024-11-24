import { ShaderMaterial } from "three";
import { Color } from "three";
const zColorMaterial = new ShaderMaterial({
  blendColor: Color.NAMES.violet,
  blendEquation: 100,
  blendSrc: 205,
  blendDst: 204,
  blendEquationAlpha: 100,
  blendSrcAlpha: 205,
  blendDstAlpha: 204,
  blending: 1,
  clipIntersection: false,
  clipping: false,
  clipShadows: false,
  colorWrite: true,
  depthFunc: 3,
  depthTest: true,
  depthWrite: true,
  dithering: false,
});

// Define a shader material to color points based on z-coordinate
// const zColorMaterial = new ShaderMaterial({
//     uniforms: {
//         // Define color stops and min/max z values
//         minZ: { value: -10 },  // Adjust based on your z-coordinate range
//         maxZ: { value: 10 },
//       },
//       vertexShader: `
//         varying float vZ;

//         void main() {
//           vZ = position.z;  // Pass z-coordinate to fragment shader
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform float minZ;
//         uniform float maxZ;
//         varying float vZ;

//         void main() {
//           // Map z-coordinate to a value between 0 and 1
//           float normalizedZ = (vZ - minZ) / (maxZ - minZ);
//           vec3 color = vec3(normalizedZ, 0.5, 1.0 - normalizedZ);  // Customize the color gradient
//           gl_FragColor = vec4(color, 1.0);  // Set point color
//         }
//       `,
// });

export default zColorMaterial;
