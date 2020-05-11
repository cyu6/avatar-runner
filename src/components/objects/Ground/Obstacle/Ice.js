import { Group } from 'three';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Ice extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
        };

        this.name = 'iceblock';

        var loader = new THREE.TextureLoader();

        // credits: https://3dtextures.me/2018/01/04/ice-002/
        var obsTexture = loader.load('/src/images/Ice_001_COLOR.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var normTexture = loader.load('/src/images/Ice_001_NRM.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var displacement = loader.load('/src/images/Ice_001_DISP.png', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        // var occlusion = loader.load('/src/images/Ice_001_OCC.jpg', function(texture) {
        //     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        //     texture.offset.set(0, 0);
        //     texture.repeat.set(3, 2);
        // });

        var specular = loader.load('/src/images/Ice_001_SPEC.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var obsGeometry = new THREE.BoxBufferGeometry(5, 4, 0.25, 50, 40);
        var obsMaterial = new THREE.MeshPhongMaterial({color: 0xbddeec, flatShading: true, map: obsTexture, normalMap: normTexture,
                                                       displacementMap: displacement, displacementScale: 0.1, specularMap: specular,
                                                       opacity: 0.8, });
        var obs = new THREE.Mesh(obsGeometry, obsMaterial);
        obs.castShadow = true;
        obs.position.y = 2.2;
        obs.position.z = -10;
        this.add(obs);

        // Add self to parent's update list
        // parent.addToUpdateList(this);
        // parent.add(obs);
    }

    update(timeStamp) {

        // if (this.state.bob) {
        //     // Bob back and forth
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        // }
        // if (this.state.twirl > 0) {
        //     // Lazy implementation of twirl
        //     this.state.twirl -= Math.PI / 8;
        //     this.rotation.y += Math.PI / 8;
        // }

        // Advance tween animations, if any exist
        // TWEEN.update();
    }
}

export default Ice;
