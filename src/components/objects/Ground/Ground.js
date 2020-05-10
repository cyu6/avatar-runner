import { Group, Bone } from 'three';
import * as THREE from 'three';
import { Obstacle, Rock, Ice, Gap, Fire } from './Obstacle';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import game from '../../../game';

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
            objects: [],
        };

        var loader = new THREE.TextureLoader();

        // credits: https://3dtextures.me/2020/01/14/rock-038/
        var groundTexture = loader.load('/src/images/ground.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 30);
        });
        var groundNormal = loader.load('/src/images/ground_normal.jpg', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 30);
        });
        var groundDisplacement = loader.load('/src/images/ground_displacement.png', function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 30);
        });

        this.name = 'ground';
        var planeGeometry = new THREE.PlaneGeometry(7, 150, 7, 150);
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

        // const rock = new Rock(this);
        // this.add(rock);
        // this.state.objects.push(rock);

        // Add ice block
        // const ice = new Ice();
        // this.add(ice);
        // this.state.objects.push(ice);

        // Add fire
        // var fire1 = new Fire(this);
        // fire1.scale.set(7, 7, 5);
        // fire1.position.set(0, 0, -20);
        // var fire2 = new Fire(this);
        // fire2.scale.set(5, 5, 5);
        // fire2.position.x = -2.5;
        // var fire3 = new Fire(this);
        // fire3.scale.set(5, 5, 5);
        // fire3.position.x = 2.5;
        // this.add(fire1);
        // this.add(fire2);
        // this.add(fire3);
        // this.state.objects.push(fire1);
        // this.state.objects.push(fire2);
        // this.state.objects.push(fire3);



        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
        this.state.clock.start();
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    spawnObstacles(temp) {
        // Add another obstacle
        if (this.state.clock.getElapsedTime() > 8.0) {
            this.state.clock.start();
            let index = Math.floor(Math.random() * 3 );
            if (index == 0) {
                const new_rock = new Rock(this);
                new_rock.children[0].position.z -= this.position.z;
                this.add(new_rock);
                temp.push(new_rock);
            } else if (index == 1) {
                const new_obs = new Ice(this);
                new_obs.children[0].position.z -= this.position.z;
                this.add(new_obs);
                temp.push(new_obs);
            } else {
                var fire1 = new Fire(this);
                fire1.scale.set(7, 7, 5);
                fire1.position.set(0, 0, -20 - this.position.z);
                // fire1.children[0].position.z -= this.position.z;
                this.add(fire1);
                temp.push(fire1);                
            }
        }

    }

    update(timeStamp, obstacles) {

        this.position.z += 0.09;

        const { updateList, objects } = this.state;
        
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
            if (obj instanceof Fire) obj.update(this.state.clock.elapsedTime);
            else obj.update(timeStamp);
        }

        // debugger
        // remove if not visible
        var temp = [];
        temp = objects.filter(function(e) { return e.visible });

        if (game.status == "playing") {
            this.spawnObstacles(temp);
        }

        this.state.objects = temp;
    }
}

export default Ground;
