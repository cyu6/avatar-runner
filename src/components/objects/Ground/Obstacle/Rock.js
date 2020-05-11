import { Group } from 'three';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Rock extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
            distance: 0,
        };

        this.name = 'rock';
        const radius = 1.2
        var rockGeometry = new THREE.DodecahedronGeometry(radius , 2);

        var loader = new THREE.TextureLoader();
        var rockTexture = loader.load('/src/images/ground.jpg');
        var rockNormal = loader.load('/src/images/ground_normal.jpg');
        var rockDisplacement = loader.load('/src/images/ground_displacement.png');
        var rockMaterial = new THREE.MeshStandardMaterial({map: rockTexture, normalMap: rockNormal, displacementMap: rockDisplacement, displacementScale: 0.5});
        var rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.position.y = radius;
        rock.position.z = -5;
        this.state.distance = rock.position.z;
        this.add(rock);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {

        if (this.position.z - this.state.distance > 15) {
            // delete element
            this.parent.removeObject(this);
        }

        this.position.z += 0.08;

        //quaternion = new THREE.Quaternion().setFromAxisAngle(, 0.1);
    }
}

export default Rock;
