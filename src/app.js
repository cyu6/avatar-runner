/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GameScene } from 'scenes';
import * as THREE from 'three';
import game from './game';

var scene, camera, renderer, scorekeeper;

function createScene() {
    // Initialize core ThreeJS components
    scene = new GameScene();
    // antialiasing, transparent backdrop
    renderer = new WebGLRenderer({ antialias: true, alpha: true }); 

    // Set up camera
    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    // controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;
    // controls.enablePan = false;
    // controls.minDistance = 4;
    // controls.maxDistance = 16;
    // controls.update();

    // Set up scorekeeper
    scorekeeper = {
        oldScore: 0,
        startTime: null,
        status: "start",
    };
}

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    if (game.status == "pause") {
        return;
    }
    else if (game.status == "end") {
        game.status = "waitingReplay";
        scorekeeper.status = "stop";
        showReplay();
        return;
    } 
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    if (scorekeeper.status == "playing")
        updateScore();
    window.requestAnimationFrame(onAnimationFrameHandler);
};

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

function onPauseHandler(event) {
    if (!(event.keyCode === 32)) {
        return;
    }

    if (game.status == "playing") {
        game.status = "pause";
        pause.style.display = "block";

        var current = new Date().getTime();
        scorekeeper.oldScore += (current - scorekeeper.startTime);
        scorekeeper.status = "pause";
    } else if (game.status == "pause") {
        // want to restart
        game.status = "playing";
        pause.style.display = "none";
        scorekeeper.status = "playing"
        var current = new Date().getTime();
        scorekeeper.startTime = current;
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
    return;
}

function replayClick() {
    hideReplay();
    game.status = "playing";
    scorekeeper = {
        oldScore: 0,
        startTime: new Date().getTime(),
        status: "playing",
    };
    scene.resetScene();
    window.requestAnimationFrame(onAnimationFrameHandler);        
}

function showReplay() {
    background.style.display = "block";
    replayDiv.style.display = "block";
}

function hideReplay() {
    background.style.display = "none";
    replayDiv.style.display = "none";
}

function startGame() {
    background.style.display = "none";
    landingDiv.style.display = "none";
    scoreDiv.style.display = "block";
    game.status = "playing";
    scorekeeper.startTime = new Date().getTime();
    scorekeeper.status = "playing";
}

function updateScore() {
    var current = new Date().getTime();
    score_value.innerHTML = Math.floor((scorekeeper.oldScore + (current - scorekeeper.startTime)) / 1000) ;
}

var replayDiv, replayButton, startButton, landingDiv, background, pause, scoreDiv, score_value;

function init() {

    background = document.getElementById("background");
    landingDiv = document.getElementById("landing");
    replayDiv = document.getElementById("replayGame");
    replayButton = document.getElementById("replayButton");
    startButton = document.getElementById("startButton");
    startButton.onclick = function() { startGame() };
    replayButton.onclick = function() { replayClick() };
    pause = document.getElementById("pause");
    scoreDiv = document.getElementById("score");
    score_value = document.getElementById("score_value");

    game.status = "ready";
    createScene();

    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler, false); 
    window.addEventListener('keydown', onPauseHandler);

    window.requestAnimationFrame(onAnimationFrameHandler);    
}
window.addEventListener('load', init, false)