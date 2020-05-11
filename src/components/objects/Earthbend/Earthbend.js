import { Group, BoxBufferGeometry, Geometry,Mesh, MeshStandardMaterial, TextureLoader} from 'three';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import TEXTURE from '../../../textures/ground.jpg';
import NORMAL from '../../../textures/ground_normal.jpg';

class Earthbend extends Group {
    constructor(parent, xpos) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            bob: true,
            spin: this.spin.bind(this),
        };

        this.name = 'earthbend';

        var geometry = new BoxBufferGeometry(3, 1, 10);

        var loader = new TextureLoader();

        // credits: https://3dtextures.me/2020/01/14/rock-038/
        var groundTexture = loader.load(TEXTURE);
        var groundNormal = loader.load(NORMAL);;

        var material = new MeshStandardMaterial({ color: 0x909A94,
            map: groundTexture, normalMap: groundNormal});

        var bridge = new Mesh(geometry, material);

        // bridge rises from below ground level
        bridge.position.y = -2;
        bridge.position.x = xpos;

        this.add(bridge);
        parent.addToUpdateList(this);
    }

    handleCollisions(obstacles)  {

    }


    spin() {
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp, obstacles) {
        // max height of bridge should not exceed ground level
        if (this.position.y < 1.5) {
            this.position.y += 0.1;
        }
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        // bridge moves with ground;
        this.position.z += 0.09;

        TWEEN.update();
    }
}

export default Earthbend;
