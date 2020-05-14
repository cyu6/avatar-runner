import { Group, Clock, TextureLoader, PlaneBufferGeometry, MeshStandardMaterial, Mesh } from 'three';
import { Rock, Ice, Fire, Gap } from './Obstacle';
import * as THREE from 'three';
import game from '../../../game';
import TEXTURE from '../../../textures/ground.jpg';
import NORMAL from '../../../textures/ground_normal.jpg';
import DISP from '../../../textures/ground_displacement.png';

class Ground extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        // Idea for later: can choose between different textures for the ground

        this.state = {
            updateList: [],
            clock: new Clock(),
            objects: [],
            current: false,
        };

        var loader = new TextureLoader();

        // credits: https://3dtextures.me/2020/01/14/rock-038/
        var groundTexture = loader.load(TEXTURE, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 30);
        });
        var groundNormal = loader.load(NORMAL, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 30);
        });
        var groundDisplacement = loader.load(DISP, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(1, 30);
        });

        this.name = 'ground';
        var planeGeometry = new PlaneBufferGeometry(7, 150, 7, 150);
        var planeMaterial = new MeshStandardMaterial({ color: 0x909A94, side: THREE.DoubleSide, 
            map: groundTexture, normalMap: groundNormal, displacementMap: groundDisplacement});
        var plane = new Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, -.3, 0);
        plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
        plane.receiveShadow = true;
        this.add(plane);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.state.clock.start();
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    removeObject(object) {

        if (!(object instanceof Gap)) {
            const index1 = this.state.updateList.indexOf(object);
            this.state.updateList.splice(index1, 1);
        }
        const index2 = this.state.objects.indexOf(object);
        if (index2 > -1) this.state.objects.splice(index2, 1);
        this.remove( object );
    }

    spawnObstacles(temp) {
        // Add another obstacle
        if (this.state.clock.getElapsedTime() > 4.75) {
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
                fire1.scale.set(7, 3, 2);
                fire1.position.set(0, 1, -15 - this.position.z);
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
            if (obj instanceof Fire) obj.update(this.state.clock.elapsedTime);
            else obj.update(timeStamp);
        }

        if (game.status == "playing" && this.state.current) {
            this.spawnObstacles(objects);
        }
    }
}

export default Ground;
