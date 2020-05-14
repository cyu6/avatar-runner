import { Group, BoxBufferGeometry, Geometry, Mesh, MeshStandardMaterial, TextureLoader} from 'three';
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import TEXTURE from '../../../textures/ground.jpg';
import NORMAL from '../../../textures/ground_normal.jpg';
import { Gap } from 'objects';

class Earthbend extends Group {
    constructor(parent, xpos) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            bob: true,
            spin: this.spin.bind(this),
            distance: 0,
        };

        this.name = 'earthbend';

        var geometry = new BoxBufferGeometry(7, 1, 12);

        var loader = new TextureLoader();

        // credits: https://3dtextures.me/2020/01/14/rock-038/
        var groundTexture = loader.load(TEXTURE);
        var groundNormal = loader.load(NORMAL);;

        var material = new MeshStandardMaterial({ color: 0x909A94,
            map: groundTexture, normalMap: groundNormal});

        var bridge = new Mesh(geometry, material);

        // bridge rises from below ground level
        bridge.position.y = -2.2;
        bridge.position.x = 0;
        this.state.distance = bridge.position.z;

        this.add(bridge);
        parent.addToUpdateList(this);
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

    handleCollisions(obstacles)  {

        var mesh = this.children[0];
        
        function detectBoxCollision(object1, object2) {
            object1.geometry.computeBoundingBox(); 
            object2.geometry.computeBoundingBox();
            object1.updateMatrixWorld();
            object2.updateMatrixWorld();
            
            var box1 = object1.geometry.boundingBox.clone();
            box1.applyMatrix4(object1.matrixWorld);
    
            var box2 = object2.geometry.boundingBox.clone();
            box2.applyMatrix4(object2.matrixWorld);
    
            return box1.intersectsBox(box2);
        }

        for (var obs in obstacles) {
            var collision = detectBoxCollision(obstacles[obs].children[0], mesh);
            if (collision && (obstacles[obs] instanceof Gap)) {
                obstacles[obs].parent.removeObject(obstacles[obs]);
                // this.parent.removeObject(this);
                // console.log("EARTH HIT ", obstacles[obs]);
                return;
            }
        }
    }

    update(timeStamp, obstacles) {
        if (this.state.distance - this.position.z > 10) {
            // delete element
            this.parent.removeObject(this);
        }
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

        this.handleCollisions(obstacles);

    }
}

export default Earthbend;
