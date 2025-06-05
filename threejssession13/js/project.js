import * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';


const container = document.getElementById('lighting');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth /container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true; //Enables shadow in the renderer.
renderer.shadowMap.type = THREE.PCFShadowMap; //Softer edges.


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const loader = new THREE.TextureLoader();
loader.load('./assets/thumbnails/1-metal.jpg', (texture) => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({map: texture});
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true; //Enables casting shadows.
    //sphere.position.y = 0; Optional and ensures it's above the floor.
    scene.add(sphere);
});

//Ambient Light: Soft light that affects all objects equally.
const ambient = new THREE.AmbientLight(0xffffff, 0.3); //Colour, intensity.
scene.add(ambient);

//Directional Light: Like sunlight.
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 5); //Light direction.
scene.add(directional);

//Point Light: Like a light bulb.
const point = new THREE.PointLight(0xffaa00, 1, 10); //Warm yellow tone.
point.position.set(0, 2, 2); //Above and in front of the object.
scene.add(point);


//Small point to visualize the point light source.
const lightIndicator = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshBasicMaterial({color: 0xffaa00})
);
lightIndicator.position.copy(point.position); //Copies the position of the point light into the small sphere that it represents visually.
scene.add(lightIndicator);

directional.castShadow = true;
directional.shadow.mapSize.width = 1024; //Sets the resolution of the shadow map with height and width.
directional.shadow.mapSize.height = 1024;
directional.shadow.camera.near = 1; //Minimum distance from the light to start casting.
directional.shadow.camera.far = 20; //Maximum distance from the light to cast shadows.
directional.shadow.camera.left = -5; //Bounds which define how wide the shadow casting area is.
directional.shadow.camera.right = 5;
directional.shadow.camera.top = 5;
directional.shadow.camera.bottom = -5;

//Create a floor so we can see the shadow effect.
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.ShadowMaterial({opacity: 0.4}) //Only shows shadows and not colour.
);

floor.rotation.x = -Math.PI / 2; //Rotates it to be horizontal.
floor.position.y = -1; //Lowers it beneath the sphere.
floor.receiveShadow = true; //Floor accepts shadow.
scene.add(floor);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});