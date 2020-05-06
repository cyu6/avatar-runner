import { Group, Clock, Mesh, Geometry, Raycaster } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './avatar.gltf';
import { Water } from './Water';
import { Fire } from './Fire';


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
            updateList: [],
            mesh: new Mesh(),
        }
        this.position.set(0, 0, 6);
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

            gltf.scene.traverse(function(node) {
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

    useWater() {
        const bubble = new Water(this);
        this.add(bubble);
    }

    useFire() {
        const fireball = new Fire(this);
        this.add(fireball);
    }

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

    update(timeStamp, obstacles) {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);

        TWEEN.update();

        const { updateList, mesh } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update();
        }

        // this.handleCollisions(obstacles, mesh);
    }
}


export default Avatar;
