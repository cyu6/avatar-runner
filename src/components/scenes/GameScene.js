import * as Dat from 'dat.gui';
import { Scene, Color, FogExp2, Mesh, DodecahedronGeometry, MeshStandardMaterial } from 'three';
import { Flower, Land, Avatar } from 'objects';
import { BasicLights, GameLights } from 'lights';
import * as THREE from 'three';

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            // rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0xf0fff0);

        // Add meshes to scene
        // const land = new Land();
        this.avatar = new Avatar();
        // const flower = new Flower(this);
        const lights = new GameLights();
        // this.add(land, flower, lights);

        // Populate GUI
        // this.fog = new FogExp2(0xf0fff0, 0.14);

        // "infinite" plane
        var planeGeometry = new THREE.PlaneGeometry(7, 1000000);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x909A94, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, -.3, 0);
        plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
        this.add(plane);

        var heroGeometry = new DodecahedronGeometry(0.3, 1);
        var heroMaterial = new MeshStandardMaterial({ color: 0xe5f2f2, shading: THREE.FlatShading })
        var hero = new Mesh(heroGeometry, heroMaterial);
        hero.castShadow = true;
        hero.receiveShadow = false;

        this.add(hero, lights, this.avatar);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        // const { rotationSpeed, updateList } = this.state;

        // // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }

        // this.plane.position.x = position.x;
		// this.plane.y = position.y;
        const { updateList } = this.state;
        
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        if (this.avatar.mixer) this.avatar.mixer.update(timeStamp / 10000000);
    }
}

export default GameScene;
