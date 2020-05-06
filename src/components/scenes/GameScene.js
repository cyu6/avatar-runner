import * as Dat from 'dat.gui';
import { Scene, Color, FogExp2 } from 'three';
import { Ground, Avatar } from 'objects';
import { GameLights } from 'lights';
import * as THREE from 'three';
import Background from '../objects/Background/Background';

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

        // Set background and fog
        this.background = new Color(0xf0fff0);
        this.fog = new FogExp2(0xf0fff0, 0.07);

        // Add meshes to scene
        const avatar = new Avatar(this);
        const lights = new GameLights();
        this.add(lights, avatar);

        // "infinite" plane
        const ground = new Ground(this);
        this.add(ground);

        // scenery
        const scenery = new Background(this);
        this.add(scenery);

        // Basic keyboard controls - should these be in the avatar constructor?
        function handleKeyDown(event) {
            // debugger
            if (event.key == "ArrowLeft") {
                avatar.moveLeft = true;
                avatar.moveRight = false;
            } else if (event.key == "ArrowRight") {
                avatar.moveRight = true;
                avatar.moveLeft = false;
            } else return;
            
            avatar.moveAvatar();
        };
        window.addEventListener('keydown', handleKeyDown, false);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;
        
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default GameScene;
