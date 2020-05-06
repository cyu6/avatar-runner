import { Group, Clock, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './avatar.gltf';


class Avatar extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // set position of runner (increasing z moves runner closer to viewer)
        this.state = {
            move: false,
            left: false,
            right: false,
            speed: 0,
        }
        this.position.set(0, 0, 6);
        this.name = 'avatar';
        this.mixer;

        this.clock = new Clock();
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.mixer = new AnimationMixer(gltf.scene);
            gltf.scene.rotation.y = 3;
            this.mixer.timescale = 0.01
            var action = this.mixer.clipAction(gltf.animations[0]);
            action.play();

            gltf.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }

            });
            this.add(gltf.scene);
        });

        parent.addToUpdateList(this);
    }

    moveAvatar() {
        if (this.move == true) {
            if (this.left == true) {
                if (this.position.x == -2.5) return;
                let targetx = this.position.x - 2;
                if (targetx < -2.5) targetx = -2.5;
            
                const goLeft = new TWEEN.Tween(this.position).to({ x: targetx }, 1000).easing(TWEEN.Easing.Quadratic.Out);
                goLeft.start();
            }
            else if (this.right == true) {
                if (this.position.x == 2.5) return;
                let targetx = this.position.x + 2;
                if (targetx > 2.5) targetx = 2.5;
                const goRight = new TWEEN.Tween(this.position).to({ x: targetx }, 1000).easing(TWEEN.Easing.Quadratic.Out);
                goRight.start();
            }
        }
    }

    update() {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);

        TWEEN.update();
    }
}


export default Avatar;
