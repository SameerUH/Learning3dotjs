//Import everything from Three.js
import * as THREE from 'three';

//Creates a scene.
const scene = new THREE.Scene();

//Creates a camera (75 - FOV, width/height - Aspect ratio, 0.1 - Near clipping plane, 1000 - Far clipping plane.)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Moves the camera back so we can see the cube.
camera.position.z = 5;

//Creates a renderer to draw everything on the screen.
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight); //Fullscreen
document.body.appendChild(renderer.domElement);//Adds canvas to the page.

//Rotating box:
const box_width = 1;
const box_height = 1;
const box_length = 1;
const box_geometry = new THREE.BoxGeometry(box_width, box_height, box_length); //Cube shape
const box_material = new THREE.MeshStandardMaterial({color: 0x00ff00});//Bright green
const cube = new THREE.Mesh(box_geometry, box_material);//Combines shape and material.
scene.add(cube);//Adds cube to the scene.

//Rotating circle:
const radius = 1;
const segments = 24;
const circle_geometry = new THREE.CircleGeometry(radius, segments)
const circle_material = new THREE.MeshStandardMaterial({color: 0xff00ff});
const circle = new THREE.Mesh(circle_geometry, circle_material);
circle.position.x = -3; //Moves the shape left by 3.
scene.add(circle);


//Adds a light for perspective and so the cube isn't completely dark.
const light = new THREE.DirectionalLight(0xffffff, 1); //White directional light.
light.position.set(5,5,10).normalize();//Positions it and normalizes the vector.
scene.add(light); //Adds the light to the scene.

//Animate function - called every frame (~60 times/sec).
function animate() {
  requestAnimationFrame(animate);//Asks the browser to call this again next frame.

  //Rotates the cube every frame.
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  circle.rotation.x += 0.01;
  circle.rotation.y += 0.01;

  //Renders the scene from the camera's perspective.
  renderer.render(scene, camera);
}
animate();

//Handles window resize to keep aspect ratio correct.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();//Recalculate the camera.
  renderer.setSize(window.innerWidth, window.innerHeight);//Resize the canvas
});