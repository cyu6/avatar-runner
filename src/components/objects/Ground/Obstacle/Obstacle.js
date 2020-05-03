import { Group } from 'three';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Obstacle extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        // Idea for later: can choose between different textures for the ground
        // Add this to GUI maybe?

        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
        };

        this.name = 'obstacle';
        var obsGeometry = new THREE.BoxBufferGeometry(3, 0.5);
        var obsMaterial = new THREE.MeshStandardMaterial({ color: 0xa39cb4, flatShading: true })
        var obs = new THREE.Mesh(obsGeometry, obsMaterial);
        obs.position.z = -5;
        this.add(obs);

        // Add self to parent's update list
        parent.addToUpdateList(this);
        // parent.add(obs);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    update(timeStamp) {

        // if (this.state.bob) {
        //     // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        // }
        // if (this.state.twirl > 0) {
        //     // Lazy implementation of twirl
        //     this.state.twirl -= Math.PI / 8;
        //     this.rotation.y += Math.PI / 8;
        // }

        // Advance tween animations, if any exist
        // TWEEN.update();
    }
}

export default Obstacle;
