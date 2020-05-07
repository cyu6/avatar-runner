/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GameScene } from 'scenes';
import * as THREE from 'three';
import game from './game';

// Initialize core ThreeJS components
const scene = new GameScene();
// const camera = new PerspectiveCamera();
// antialiasing, transparent backdrop
const renderer = new WebGLRenderer({ antialias: true, alpha: true }); 

// Set up camera
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.y = 3;
// camera.position.z = 3;
camera.position.set(0, 4, 10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
// enable shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setSize(innerWidth, innerHeight);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    if (!game.inPlay) {
        return;
    }
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// global constants for game
// maybe scene constructor / deconstructor if have time
// https://stackoverflow.com/questions/38034787/three-js-and-buttons-for-start-and-pause-animation
function onPauseHandler(event) {
    if (!(event.keyCode === 80)) {
        return;
    }

    if (game.inPlay) {
        // want to pause
        game.inPlay = false;
    } else {
        // want to restart
        game.inPlay = true;
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
    return;
}
window.addEventListener('keydown', onPauseHandler);