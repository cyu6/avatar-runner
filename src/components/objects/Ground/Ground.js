import { Group, Bone } from 'three';
import * as THREE from 'three';
import { Obstacle, Rock, Ice, Gap} from './Obstacle';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

class Ground extends Group {
    constructor(parent) {
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
            updateList: [],
            clock: new THREE.Clock(),
        };

        var loader = new THREE.TextureLoader();

        // credits: https://3dtextures.me/2020/01/14/rock-038/
        var groundTexture = loader.load('/src/images/ground.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1000);
        });
        var groundNormal = loader.load('/src/images/ground_normal.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1000);
        });
        var groundDisplacement = loader.load('/src/images/ground_displacement.png', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 1000);
        });

        this.name = 'ground';
        var planeGeometry = new THREE.PlaneGeometry(7, 10000, 7, 10000);
        // var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x909A94, displacementMap: groundDisplacement,
        //     displacementScale: 1});
        var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x909A94, side: THREE.DoubleSide, 
            map: groundTexture, normalMap: groundNormal, displacementMap: groundDisplacement});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, -.3, 0);
        plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
        plane.receiveShadow = true;
        this.add(plane);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Add obstacle
        // const obs = new Obstacle(this);
        // this.add(obs);

        const rock = new Rock(this);
        this.add(rock);
        // Add ice block
        // const ice = new Ice();
        // this.add(ice);

        // Add gap
        const gap = new Gap();
        this.add(gap);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
        this.state.clock.start();
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {

        this.position.z += 0.03;

        const { updateList, clock } = this.state;
        
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        // Add another obstacle
        // if (clock.getElapsedTime() > 10.0) {
        //     clock.start();
        //     const new_obs = new Obstacle(this);
        //     new_obs.children[0].position.z -= this.position.z;
        //     this.add(new_obs);
        // }

        if (clock.getElapsedTime() > 15.0) {
            clock.start();
            const new_rock = new Rock(this);
            new_rock.children[0].position.z -= this.position.z;
            this.add(new_rock);
        }

        // if (this.state.bob) {
        //     // Bob back and forth
        //     this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
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

export default Ground;
