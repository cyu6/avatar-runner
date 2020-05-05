import { Group, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Background extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        // Idea for later: can choose between different textures for the ground
        // Add this to GUI maybe?

        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
            // updateList: [],
            // clock: new THREE.Clock(),
        };

        var self = this;

        new MTLLoader()
            .setPath('/src/components/objects/Background/files/')
            .load( 'mount.blend1.mtl', function ( materials ) {

                materials.preload();

                new OBJLoader()
                    .setMaterials( materials )
                    .setPath('/src/components/objects/Background/files/')
                    .load( 'mount.blend1.obj', function ( object ) {
                        object.position.x = -9;
                        object.position.y = -3;
                        for (let child in object.children) {
                            // debugger
                            object.children[child].scale.set(2, 2, 2);
                        }
                        self.add( object );
                        let clone = object.clone();
                        clone.position.x = 10;
                        clone.position.z = -5;
                        self.add(clone);

                    }, 
                    function ( xhr ) {
                        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                    },
                    function ( error ) {
                        console.log( 'An error happened' );
                    } 
                    );
        } );

        // Add self to parent's update list
        // parent.addToUpdateList(this);

    }

    update(timeStamp) {

        // this.position.z += 0.03;

        // const { updateList, clock } = this.state;
        
        // // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }

        // // Add another obstacle
        // if (clock.getElapsedTime() > 10.0) {
        //     clock.start();
        //     const new_obs = new Obstacle(this);
        //     new_obs.children[0].position.z -= this.position.z;
        //     this.add(new_obs);
        // }
    }
}

// previous Material
// Ns 96.078431
// Ka 0.000000 0.000000 0.000000
// Kd 0.050977 0.050977 0.050977
// Ks 0.001641 0.001641 0.001641
// Ni 1.000000
// d 1.000000
// illum 2

export default Background;
