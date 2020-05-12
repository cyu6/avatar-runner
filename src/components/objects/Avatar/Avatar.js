import { Group, Clock } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js';
import { AnimationClip } from 'three/src/animation/AnimationClip.js';
import 'three/src/animation/AnimationAction.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './aang.gltf';
import game from '../../../game';
import { Firebend, Waterbend, Earthbend, Airbend, Gap } from 'objects';

var LoopOnce = 2200;

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
        this.currentAction;
        this.currentlyAnimating;

        var self = this;
        this.clock = new Clock();
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            var model = gltf.scene;
            var fileAnimations = gltf.animations;

            this.mixer = new AnimationMixer(model);
            model.rotation.y = 3;
            this.mixer.timescale = 0.01

            var tPoseAnimation = AnimationClip.findByName(fileAnimations, 'TPose');
            this.tPose = this.mixer.clipAction(tPoseAnimation);

            var runningAnimation = AnimationClip.findByName(fileAnimations, 'Running');
            this.running = this.mixer.clipAction(runningAnimation);

            var jumpingAnimation = AnimationClip.findByName(fileAnimations, 'Jumping');
            this.jumping = this.mixer.clipAction(jumpingAnimation);

            var fallingAnimation = AnimationClip.findByName(fileAnimations, 'Falling');
            this.falling = this.mixer.clipAction(fallingAnimation);

            var firebendingAnimation = AnimationClip.findByName(fileAnimations, 'Firebending');
            this.firebending = this.mixer.clipAction(firebendingAnimation);

            var waterbendingAnimation = AnimationClip.findByName(fileAnimations, 'Waterbending');
            this.waterbending = this.mixer.clipAction(waterbendingAnimation);

            var earthbendingAnimation = AnimationClip.findByName(fileAnimations, 'Earthbending');
            this.earthbending = this.mixer.clipAction(earthbendingAnimation);

            var airbendingAnimation = AnimationClip.findByName(fileAnimations, 'Airbending');
            this.airbending = this.mixer.clipAction(airbendingAnimation);

            this.running.play();
            this.currentAction = this.running;
            this.currentlyAnimating = false;

            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    self.state.mesh = node;
                }
            });
            this.add(model);
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
        if (!this.currentlyAnimating) {
            const waterball = new Waterbend(this.parent, this.position.x);
            this.parent.add(waterball);
            this.currentlyAnimating = true;
            this.playModifierAnimation(this.currentAction, 0.9, this.waterbending, 0.9, this);;
        }
    }

    useFire() {
        if (!this.currentlyAnimating) {
            const fireball = new Firebend(this.parent, this.position.x);
            this.parent.add(fireball);
            this.currentlyAnimating = true;
            this.playModifierAnimation(this.currentAction, 0.25, this.firebending, 0.25, this);
        }
    }

    useEarth() {
        if (!this.currentlyAnimating) {
            const bridge = new Earthbend(this.parent, this.position.x);
            this.parent.add(bridge);
            this.currentlyAnimating = true;
            this.playModifierAnimation(this.currentAction, 0.25, this.earthbending, 0.25, this);
        }
    }


    useAir() {
        if (!this.currentlyAnimating) {
            const gust = new Airbend(this.parent, this.position.x);
            this.parent.add(gust);
            this.currentlyAnimating = true;
            this.playModifierAnimation(this.currentAction, 0.25, this.airbending, 0.25, this);
        }
    }

    tpose() {
        if (!this.currentlyAnimating) {
            this.currentlyAnimating = true;
            this.playModifierAnimation(this.currentAction, 0.1, this.tPose, 0.1, this);
        }
    }

    fall() {
        // game.status = "falling";
        // this.position.z -= 1;
        // this.playModifierAnimation(this.currentAction, 0.25, this.falling, 0.25, this);
        
        // // debugger
        // // var self = this;
        // // this.playModifierAnimation(this.currentAction, 0.25, this.falling, 0.25, this);
        // setTimeout(function() {
        //     game.status = "end";
        // }, 3000);
    }

    // Code adapted from 
    // https://tympanus.net/codrops/2019/10/14/how-to-create-an-interactive-3d-character-with-three-js/
    playModifierAnimation(from, fSpeed, to, tSpeed, self) {
        to.setLoop(LoopOnce);
        to.reset();
        to.play();

        from.crossFadeTo(to, fSpeed, true);
        setTimeout(function() {
            from.enabled = true;
            to.crossFadeTo(from, tSpeed, true);
            self.currentlyAnimating = false;
            // console.log("timeout over");
        }, to._clip.duration * 750 - ((tSpeed + fSpeed) * 750));
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
                // if (obstacles[obs] instanceof Gap) this.fall();
                game.status = "end";
            }
        }
    }

    update(timeStamp, obstacles) {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);

        TWEEN.update();

        const { updateList, mesh } = this.state;

        if (game.status == "playing") this.handleCollisions(obstacles, mesh);

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
