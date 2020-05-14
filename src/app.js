/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols.js';
import { GameScene } from 'scenes';
import * as THREE from 'three';
import game from './game';
import './game.css';
import ALOAD from './images/appa.png';
import LOGO from './images/atla_logo.svg';
import PAUSE from './images/pause.svg';
import SOUND from './sound/background.mp3';

var head = document.getElementsByTagName('HEAD')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = './src/game.css';
head.appendChild(link);

var scene, camera, renderer, scorekeeper, sound;
// var controls;

function createScene() {
    // Initialize core ThreeJS components
    scene = new GameScene();
    // antialiasing, transparent backdrop
    renderer = new WebGLRenderer({ antialias: true, alpha: true });

    // Set up camera
    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 10);
    camera.lookAt(new Vector3(0, 0, 0));

    // Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);
    // enable shadow
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; // Fix scrolling
    document.body.appendChild(canvas);

    sound = document.createElement("audio");
    sound.src = SOUND;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);

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
        sound.pause();
        var current = new Date().getTime();
        scorekeeper.oldScore += (current - scorekeeper.startTime);
        scorekeeper.status = "pause";
    } else if (game.status == "pause") {
        // want to restart
        game.status = "playing";
        pause.style.display = "none";
        sound.play();
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
    sound.play();
    window.requestAnimationFrame(onAnimationFrameHandler);
}

function showReplay() {
    background.style.display = "block";
    replayDiv.style.display = "block";
    sound.pause();
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

    sound.play();
}

function updateScore() {
    var current = new Date().getTime();
    score_value.innerHTML = Math.floor((scorekeeper.oldScore + (current - scorekeeper.startTime)) / 1000);
}

var replayDiv, replayButton, startButton, loading, landingDiv, background, pause, scoreDiv, score_value;

function init() {

    loading = document.getElementById("loading");
    background = document.getElementById("background");
    landingDiv = document.getElementById("landing");
    replayDiv = document.getElementById("replayGame");
    replayButton = document.getElementById("replayButton");
    startButton = document.getElementById("startButton");
    startButton.onclick = function () { startGame() };
    replayButton.onclick = function () { replayClick() };
    pause = document.getElementById("pause");
    scoreDiv = document.getElementById("score");
    score_value = document.getElementById("score_value");

    // Insert images into HTML
    var appa = document.createElement("img");
    appa.src = ALOAD;
    appa.alt = "appa loading icon";
    appa.className = "appa";
    loading.prepend(appa);

    var landinghead = document.getElementById("landing_header");
    var logo = document.createElement("img");
    logo.src = LOGO;
    logo.alt = "avatar logo";
    logo.style.width = "40%";
    landinghead.prepend(logo);

    var pause_icon = document.createElement("img");
    pause_icon.src = PAUSE;
    pause_icon.alt = "pause icon";
    pause.appendChild(pause_icon);

    game.status = "ready";
    createScene();

    setTimeout(() => {
        loading.style.display = 'none';
        landingDiv.style.display = 'block';
    }, 4000);

    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler, false);
    window.addEventListener('keydown', onPauseHandler);

    window.requestAnimationFrame(onAnimationFrameHandler);
}
window.addEventListener('load', init, false)