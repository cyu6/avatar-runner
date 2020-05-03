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
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        // this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        // const land = new Land();
        this.avatar = new Avatar();
        // const flower = new Flower(this);
        const lights = new GameLights();
        // this.add(land, flower, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        this.fog = new FogExp2( 0xf0fff0, 0.14 );

        var heroGeometry = new DodecahedronGeometry( 0.2 , 1);
	    var heroMaterial = new MeshStandardMaterial( { color: 0xe5f2f2, shading: THREE.FlatShading } )
        var hero = new Mesh( heroGeometry, heroMaterial );
        hero.castShadow=true;
        hero.receiveShadow=false;

        this.add(hero, lights, this.avatar);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        // const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        if (this.avatar.mixer) this.avatar.mixer.update(timeStamp / 10000000);
    }
}

export default GameScene;
