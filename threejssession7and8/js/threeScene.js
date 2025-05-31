import  * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({antialias: true});

const container = document.getElementById('three-container'); //Places it in the three-container div in index.php file
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const textureLoader = new THREE.TextureLoader(); //Creates a texture loader instance used to load images on 3D images.
const texture = textureLoader.load('./assets/textures/1-metal.jpg', (texture) => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({map: texture,}); //Instead of using colours, you map the texture onto the shape.
  const cube = new THREE.Mesh(geometry, material);
  cube.userData = {
    url: 'https://w23002216.nuwebspace.co.uk/website/index.php' //Stores a custom link in the cube.
  };
  scene.add(cube);

  //OrbitControls lets the user rotate/zoom/pan the camera using the mouse.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //Smooth camera movement.
  controls.dampingFactor = 0.05; //How soft the movement feels.

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  //Listens for clicks and open's the cube's link in a new tab when clicked.
  window.addEventListener('click', () => {
    if (hovered && hovered.userData.url) { //Logical safety check.
      window.open(hovered.userData.url, '_blank'); //JavaScript function that tells the browser to open a new tab.
    }
  });

  //Highlights the cube when mouse hovers over it.
  window.addEventListener('mousemove', (event) => {
    const bounds = container.getBoundingClientRect(); //Gets canvas position on the screen.

    // Convert mouse position to normalized device coordinates
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1; //Finds the relative mouse x position in the canvas.
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1; //Finds the relative mouse y position in the canvas.

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    // If hovering over a new object.
    if (intersects.length > 0) { //Checks if the raycaster hits anything.
      const target = intersects[0].object; //Gets the closest object that was hit by the ray.
      if (hovered !== target) { //Checks if the object is different than the one hovered before.
        if (hovered) hovered.material.emissive.set(0x000000); //Reset old one.
        hovered = target; //Updates the reference.
        hovered.material.emissive.set(0x444444); //Highlight new one.
      }
    } else if (hovered) { //If no object is hovered (Remember hovered is null).
      hovered.material.emissive.set(0x000000); //If not hovering any object, remove highlight.
      hovered = null;
    }
    });

  //Handles window resize to keep aspect ratio correct.
  window.addEventListener('resize', () => {
    const width = container.clientWidth; //The visible width of the div element.
    const height = container.clientHeight; //The visible height of the div element.
    camera.aspect = width/height; //Updates the aspect ratio based on the variables set before.
    camera.updateProjectionMatrix(); //Recalculate the camera.
    renderer.setSize(width, height); //Resize the canvas
  });
  
  //Render loop.
  function animate() {
    requestAnimationFrame(animate);

    controls.update(); //Required for damping to work; updates the camera on each frame.
    renderer.render(scene, camera);
  }

  animate(); //Loads and uses the texture.
  });
