import { Group} from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {AnimationMixer} from 'three/src/animation/AnimationMixer.js';
import MODEL from './avatar.gltf';

class Avatar extends Group{
    constructor() {
        // Call parent Group() constructor
        super();

        // set position of runner (increasing z moves runner closer to viewer)
        this.position.set(0, 0, 1);
        this.name = 'avatar';
        this.mixer;

        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
        	this.mixer = new AnimationMixer(gltf.scene);
            gltf.scene.rotation.y = 3;
        	this.mixer.timescale = 0.01
        	var action = this.mixer.clipAction(gltf.animations[0]);
        	action.play();

            this.add(gltf.scene);
        });
    }
}

export default Avatar;
