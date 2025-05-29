import  * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const textureLoader = new THREE.TextureLoader(); //Creates a texture loader instance used to load images on 3D images.
const texture = textureLoader.load('./assets/textures/1-metal.jpg', (texture) => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({map: texture,}); //Instead of using colours, you map the texture onto the shape.
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //OrbitControls lets the user rotate/zoom/pan the camera using the mouse.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //Smooth camera movement.
  controls.dampingFactor = 0.05; //How soft the movement feels.

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  window.addEventListener('click', (event) => {
    // Convert mouse position to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    // If the cube is clicked, change its color
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      clickedObject.material.color.set(Math.random() * 0xffffff);
    }});

    
    function animate() {
      requestAnimationFrame(animate);

      controls.update(); //Required for damping to work; updates the camera on each frame.
      renderer.render(scene, camera);
    }

    animate();
}); //Loads and uses the texture.
