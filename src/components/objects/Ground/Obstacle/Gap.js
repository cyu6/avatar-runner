import { Group } from 'three';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Gap extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
        };

        // maybe box geometry instead of plane?

        this.name = 'gap';
        var planeGeometry = new THREE.PlaneGeometry(7, 5);
        var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x368B3E, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -.25;
        plane.position.z = -20;
        plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
        plane.receiveShadow = true;
        this.add(plane);


        // Add self to parent's update list
        // parent.addToUpdateList(this);
        // parent.add(obs);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    update(timeStamp) {

        // if (this.state.bob) {
        //     // Bob back and forth
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
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

export default Gap;
