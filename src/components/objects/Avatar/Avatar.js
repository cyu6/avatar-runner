import { Group} from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {AnimationMixer} from 'three/src/animation/AnimationMixer.js';
import MODEL from './avatar.gltf';

class Avatar extends Group{
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'avatar';
        this.mixer;

        loader.load(MODEL, (gltf) => {
        	this.mixer = new AnimationMixer(gltf.scene);
        	this.mixer.timescale = 0.01
        	var action = this.mixer.clipAction(gltf.animations[0]);
        	action.play();

            this.add(gltf.scene);
        });
    }
}

export default Avatar;
