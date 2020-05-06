import { Group } from 'three';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Obstacle extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
        };

        this.name = 'rock';
        var rockGeometry = new THREE.DodecahedronGeometry(1.2 , 2);
        var rockMaterial = new THREE.MeshStandardMaterial({ color: 0xa39cb4, flatShading: true })
        var rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.position.z = -5;
        this.add(rock);

        // Add self to parent's update list
        parent.addToUpdateList(this);
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
