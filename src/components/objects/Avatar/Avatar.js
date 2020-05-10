import { Group, Clock, Mesh, Geometry, Raycaster } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './avatar.gltf';
import { Water } from './Water';
import { Fire } from './Fire';
import game from '../../../game';
import Firebend from '../Firebend/Firebend';
import Waterbend from '../Waterbend/Waterbend';

class Avatar extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // set position of runner (increasing z moves runner closer to viewer)
        this.state = {
            moveLeft: false,
            moveRight: false,
            updateList: [],
            mesh: null,
        }
        this.position.set(0, 0.5, 6);
        this.name = 'avatar';
        this.mixer;

        var self = this;
        this.clock = new Clock();
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.mixer = new AnimationMixer(gltf.scene);
            gltf.scene.rotation.y = 3;
            this.mixer.timescale = 0.01
            var action = this.mixer.clipAction(gltf.animations[0]);
            action.play();

            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    self.state.mesh = node;
                }
            });
            this.add(gltf.scene);
        });

        parent.addToUpdateList(this);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    removeFromUpdateList(object) {
        this.state.updateList = this.state.updateList.filter(function (e) { return e !== object });
    }

    moveAvatar() {
        if (this.moveLeft == true) {
            if (this.position.x == -2.5) return;
            let targetx = this.position.x - 2;
            if (targetx < -2.5) targetx = -2.5;

            const goLeft = new TWEEN.Tween(this.position).to({ x: targetx }, 1000).easing(TWEEN.Easing.Quadratic.Out);
            goLeft.start();
        }
        else if (this.moveRight == true) {
            if (this.position.x == 2.5) return;
            let targetx = this.position.x + 2;
            if (targetx > 2.5) targetx = 2.5;
            const goRight = new TWEEN.Tween(this.position).to({ x: targetx }, 1000).easing(TWEEN.Easing.Quadratic.Out);
            goRight.start();
        }
    }

    useWater() {
        const waterball = new Waterbend(this);
        this.parent.add(waterball);
    }

    useFire() {
        const fireball = new Firebend(this);
        this.parent.add(fireball);
    }

    handleCollisions(obstacles, mesh) {

        if (mesh == null) {
            return;
        }

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
            if (collision) {
                // console.log("stop");
                // could just fade in a game over screen
                game.status = "end";
            }
        }
    }

    update(timeStamp, obstacles) {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);

        TWEEN.update();

        const { updateList, mesh } = this.state;

        this.handleCollisions(obstacles, mesh);

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, obstacles);
        }

    }
}


export default Avatar;

// raycasting try of handling collisions
  // handleCollisions(obstacles, mesh) {
    //     debugger
    //     if (this.children.length == 0) {
    //         return;
    //     }
    //     // debugger
    //     var originPoint = mesh.position.clone();
    //     var geometry = new Geometry().fromBufferGeometry( mesh.geometry );
    //     for (var vertexIndex = 0; vertexIndex < geometry.vertices.length / 5; vertexIndex++) {   
    //         var localVertex = geometry.vertices[vertexIndex].clone();
    //         var globalVertex = localVertex.applyMatrix4( mesh.matrix );
    //         var directionVector = globalVertex.sub( originPoint );
    //         var ray = new Raycaster( originPoint, directionVector.clone().normalize() );
    //         var collidableMeshList = [];
    //         // debugger
    //         for (var obs in obstacles) {
    //             collidableMeshList.push(obstacles[obs].children[0]);
    //         }
    //         // directionVector = directionVector.normalize();
    //         var collisionResults = ray.intersectObjects( collidableMeshList );
    //         if ( (collisionResults.length > 0) && (collisionResults[0].distance < directionVector.length()) )  {
    //             // hit = true;
    //             // console.log("stop")
    //             // debugger
    //             var sigh = collisionResults.length + collisionResults[0].distance + directionVector.length();
    //             return true;
    //         }
    //     } 
    // }
