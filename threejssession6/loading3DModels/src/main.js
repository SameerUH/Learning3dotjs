import * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


//Create a GLTFLoader to load a 3D model.
const loader = new GLTFLoader();
loader.load(
  //Model URl (Example hosted by Three.js).
  'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',

  //onLoad callback: runs once the model is loaded.
  function (gltf) {
    const model = gltf.scene; //Gets the model's root node and is the actual 3D object.
    model.scale.set(2,2,2); //Resizes the model.
    model.position.y = -1; //Moves it down so it sits nicely.

    //Goes through all objects in the model.
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; //Allows model parts to cast shadows.
        child.receiveShadow = true; //Optional: Model receives its own shadows.
      }
    });
    scene.add(model); //Add the model to the scene.
  },
  //Runs if the model fails to laod.
  undefined, function(error) {
    console.error('An error occured while loading the model: ', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});