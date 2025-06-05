import * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';


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
    sphere.position.y = 10; //Optional and ensures it's above the floor.
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

//Shadow:
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

//Spotlight:
const spotlight = new THREE.SpotLight(0xffddaa, 1); //colour, intensity.
spotlight.position.set(3, 6, 3); //Places it above and to the side.
spotlight.target.position.set(0, 0, 0); //Aims the spotlight and adds it to the scene..
scene.add(spotlight.target);

spotlight.castShadow = true; //Enables shadows and sets dimensions.
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;

spotlight.angle = Math.PI / 6; //Cone spread.
spotlight.penumbra = 0.2; //Softnes around the edges of the spotlight.
spotlight.decay = 2; //Light fade-off.
spotlight.distance = 10; //How far the light reached.

scene.add(spotlight);

const spotlightHelper = new THREE.SpotLightHelper(spotlight); //Shows a grid which displays the cone.
//scene.add(spotlightHelper)

//Text
const textloader = new FontLoader();
const letterSpacing = 0.47;
const text = "SAMEER HAQ";

const video = document.createElement('video');
video.src = './assets/thumbnails/lettertexture.mp4';
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;


textloader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    [...text].forEach((char, i) => {
        const textgeometry = new TextGeometry(char, {
            font: font, size: 0.5, height: 0.2, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 5, 
        });

        const textmaterial = new THREE.MeshStandardMaterial({map: videoTexture});
        const textMesh = new THREE.Mesh(textgeometry, textmaterial);
        textMesh.position.x = i * letterSpacing;
        textMesh.castShadow = true;
        scene.add(textMesh);
    });
});


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