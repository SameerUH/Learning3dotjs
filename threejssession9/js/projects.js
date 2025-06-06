import * as THREE from 'three';

const container = document.getElementById('projects-showcase'); //Gets the container to attach the 3D canvas.
const tooltip = document.getElementById('tooltip'); //Gets the tooltip to be put on the 3D cubes.

const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x222222); Can be used to set a background colour.


const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
let currentZ = 5; //Starting Z position.
let scrollTargetZ = currentZ; //Scroll destination Z position.
camera.position.z = currentZ;

//Creates the renderer and attaches it to the container.
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);


//Defines the projects with names and URLs in an array.
const projects = [
    {name: 'Gratithink Website', url: 'https://w23002216.nuwebspace.co.uk/website/index.php', image: './assets/thumbnails/website.jpg'},
    {name: 'Gratithink App', url: 'https://w23002216.nuwebspace.co.uk/gratithink/app/', image: './assets/thumbnails/app.jpg'},
    {name: 'Three.js Session 7', url: 'https://w23002216.nuwebspace.co.uk/THREEDOTJS/Session7/', image: './assets/thumbnails/session7.jpg'}
]; //Added the file locations for the images to be used as textures.

const loader = new THREE.TextureLoader(); //Creates a texture loader.

loader.load('./assets/thumbnails/background.jpg', texture => { //Loads the background image from your folder.
    scene.background = texture; //Once loaded, set it as the scene's background.
});

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
        group.position.z = -index * 5 - 10; //Spaces them in a row.
        group.scale.set(0.5, 0.5, 0.5); //Starts smaller.
        group.userData = {url: project.url, name: project.name}; //Stores the URL in the objects to function later.
        group.userData.finalZ = -index * 5; //Target/end position of the cubes.
    scene.add(group);
    });
});

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


let hoveredGroup = null; //Keeps track of currently scaled object.

//Mouse move handler which highlights the hovered cube.
window.addEventListener('mousemove', (event) => {
    const bounds = container.getBoundingClientRect(); //Gets the canvas bounds.
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const target = intersects[0].object; //Get the first object the mouse is hovering over.

        let object = target;
        while (object && !object.userData.name) { //Climb up the parent chain to find the group that has the name stored in it's userData.
            object = object.parent;
        }

        if (object && object.userData.name) { //If it's a valid object with a name we found...
            tooltip.style.display = 'block'; //Show the tooltip.
            tooltip.textContent = `Name: ${object.userData.name}. URL: ${object.userData.url}`; //Sets it's text to the project name and URL..
            tooltip.style.left = `${event.clientX + 10}px`; //Move it next to the mouse.
            tooltip.style.top = `${event.clientY + 10}px`;
  
        //Reset scale of the previous hovered object if you have moved to a different object.
        if (hoveredGroup && hoveredGroup !== object) {
            hoveredGroup.scale.set(1, 1, 1);
        }

        //Scale the new object.
        hoveredGroup = object;
        hoveredGroup.scale.set(1.1, 1.1, 1.1); //Slightly larger for highlight.
    } else {
        if (hoveredGroup) {
            hoveredGroup.scale.set(1, 1, 1); //Reset scale if not hovering over anything.
        }
        hoveredGroup = null; //Resets the hoveredGroup when mouse is hovered over nothing.
        tooltip.style.display = 'none';
    }

        if (hovered !== target) {
            if (hovered) hovered.material.emissive.set(0x111111); //Remove highlight from previous.
            hovered = target;
            hovered.material.emissive.set(0x444444); //Add soft highlights.
        }
    } else if (hovered) { 
        hovered.material.emissive.set(0x111111); //Reset highlight.
        hovered = null;
        tooltip.style.display = 'none'; //If nothing is hovered, then hide the tooltip.
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

//Listens to the scroll wheel event.
window.addEventListener('wheel', (event) => {
    event.preventDefault();

    const travelSpeed = 0.25;
    scrollTargetZ += event.deltaY * 0.01 * travelSpeed; //Adjust scroll target.

    const minZ = -((projects.length - 1) * 5 + 2); //Clamp Z range so user doesn't scroll too far.
    const maxZ = 5;
    scrollTargetZ = Math.min(maxZ, Math.max(minZ, scrollTargetZ));
}, {passive:false});


//Select all navigation buttons.
document.querySelectorAll('#nav button').forEach(btn => {
    btn.addEventListener('click', () => { //Adds a click event to each button.
        const index = parseInt(btn.dataset.project); //Gets the index of the project from the button's data-project attribute.
        scrollTargetZ = (index * -5) - 4; //Set the target Z position of the camera just in front of the cube.
    });
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    currentZ += (scrollTargetZ - currentZ) * 0.05; //Smoothly interpolates to the target Z position.
    camera.position.z = currentZ;
    
    scene.children.forEach(object => {
        if (object.userData.finalZ !== undefined) {
            object.position.z += (object.userData.finalZ - object.position.z) * 0.05;

            const scale = object.scale.x + (1 - object.scale.x) * 0.05;
            object.scale.set(scale, scale, scale);
        }
    });
}
animate();