import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 5); //Moves the camera back and up.
camera.lookAt(0,0,0); //Points the camera at the center.

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //Shadows won't work without this.
document.body.appendChild(renderer.domElement);


//Creates a large plane that receives the shadow.
const planeGeometry = new THREE.PlaneGeometry(10,10);
const planeMaterial = new THREE.ShadowMaterial({opacity: 0.3}); //Transparent shadow receiver.
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; //Rotate flat like a floor.
plane.position.y = -1; //Move it down below the cube.
plane.receiveShadow = true; //Allows shadows to appear on the plane.
scene.add(plane);


//Creates a directional light.
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5); //Positions the light source.
light.castShadow = true; //Lets the light cast shadows.
scene.add(light);


//Creates a cube that will cast a shadow.
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material); //Allow the cube to cast a shadow.
cube.castShadow = true; //Allow the cube to cast a shadow.
cube.receiveShadow = true; //Optional: cube can shadow itself.
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //Smooth camera motion.
controls.dampingFactor = 0.05;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
