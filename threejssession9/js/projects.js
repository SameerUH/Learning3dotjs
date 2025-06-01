import * as THREE from 'three';
import {OrbitControls} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('projects-showcase'); //Gets the container to attach the 3D canvas.

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;


//Creates the renderer and attaches it to the container.
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);


//Defines the projects with names and URLs in an array.
const projects = [
    {name: 'Project 1', url: 'https://w23002216.nuwebspace.co.uk/website/index.php', image: './assets/thumbnails/website.jpg'},
    {name: 'Project 2', url: 'https://w23002216.nuwebspace.co.uk/gratithink/app/', image: './assets/thumbnails/app.jpg'},
    {name: 'Project 3', url: 'https://w23002216.nuwebspace.co.uk/THREEDOTJS/Session7/', image: './assets/thumbnails/session7.jpg'}
]; //Added the file locations for the images to be used as textures.

const loader = new THREE.TextureLoader(); //Creates a texture loader.

//For each project, create a cube and assign data.
projects.forEach((project, index) => {
    loader.load(project.image, (texture) => { //Runs when the image is loaded.
        const imageGeometry = new THREE.BoxGeometry(1, 1, 0.5); //Creates the project image cube.
        const imageMaterial = new THREE.MeshStandardMaterial({map: texture});
        const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);

        const frameGeometry = new THREE.BoxGeometry(1.1, 1.1, 0.6); //Creates a cube slightly larger than the image (for visual styling).
        const frameMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
        const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        frameMesh.position.z = -0.06; //Push it behind the image so it shows a border.

        //Group both the image and frame together into a single clickable unit.
        const group = new THREE.Group();
        group.add(frameMesh); //Add frame first.
        group.add(imageMesh); //Add image next.
        group.position.x = index * 2 - (projects.length - 1); //Spaces them in a row.
        group.userData = {url: project.url, name: project.name}; //Stores the URL in the objects to function later.
    scene.add(group);
    });
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null; //Keeps track of the currently hovered object.

//Click handler which opens the project's link.
window.addEventListener('click', (event) => {
    const bounds = container.getBoundingClientRect(); //Gets the coordinates of the container from the index.php file.

    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    //Shoots a ray to find the mouse position.
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;

        //Climb up the parent tree until we find the group that has a URL.
        while (obj && !obj.userData.url) {
            obj = obj.parent;
        }

        //If found, open it in a new tab.
        if (obj && obj.userData.url) {
            window.open(obj.userData.url, '_blank');
        }
    }
});


//Mouse move handler which highlights the hovered cube.
window.addEventListener('mousemove', (event) => {
    const bounds = container.getBoundingClientRect(); //Gets the canvas bounds.
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const target = intersects[0].object;
        if (hovered !== target) {
            if (hovered) hovered.material.emissive.set(0x111111); //Remove highlight from previous.
            hovered = target;
            hovered.material.emissive.set(0x444444); //Add soft highlights.
        }
    } else if (hovered) {
        hovered.material.emissive.set(0x111111); //Reset highlight.
        hovered = null;
    }
});


//Window resizing to keep the canvas and camera aligned.
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();