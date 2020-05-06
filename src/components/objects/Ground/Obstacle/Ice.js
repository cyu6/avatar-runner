import { Group } from 'three';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Ice extends Group {
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

        this.name = 'iceblock';

        var loader = new THREE.TextureLoader();

        // credits: https://3dtextures.me/2018/01/04/ice-002/
        var obsTexture = loader.load('/src/images/Ice_002_COLOR.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(2, 2);
        });

        var obsGeometry = new THREE.BoxBufferGeometry(5, 4, 0.25);
        var obsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, flatShading: true, map: obsTexture });
        var obs = new THREE.Mesh(obsGeometry, obsMaterial);
        obs.castShadow = true;
        obs.position.y = 2.5;
        obs.position.z = -10;
        this.add(obs);

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

export default Ice;
