import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png');

// P A R T I C L E S

// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

// Custom
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3); // Special array, accounting for x, y, z values (we need 500 * 3 items in the array)
const colors = new Float32Array(count * 3); // Special array, setting the rgb colors

for (let index = 0; index < count * 3; index++) {
  positions[index] = (Math.random() - 0.5) * 10; // Filling array. To get values from -5 to 5, instead of 0 to 1
  colors[index] = Math.random(); // Setting random values for rgb
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3) // Specifying we need 3 values
);

particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3) // Specifying we need 3 values
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // Determines the size of the geometry depending on the camera position
  //   color: '#ff88cc',
});
particlesMaterial.transparent = true; // Make particles transparent
particlesMaterial.alphaMap = particleTexture; // Assigning texture
// particlesMaterial.alphaTest = 0.001; // Tells the GPU to ignore black
// particlesMaterial.depthTest = false; // WebGL tests if the particle is in front, could create bugs if other objects or colors
particlesMaterial.depthWrite = false; //Measures distance between objects and does not draw particles in that distance
particlesMaterial.blending = THREE.AdditiveBlending; // The color is added unto whats already there, combining light. Impacts performance
particlesMaterial.vertexColors = true; // Assigning colors to each particle

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
