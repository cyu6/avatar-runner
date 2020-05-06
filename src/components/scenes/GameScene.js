import * as Dat from 'dat.gui';
import { Scene, Color, FogExp2 } from 'three';
import { Ground, Avatar, Background } from 'objects';
import { GameLights } from 'lights';
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
            obstacles: [],
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
        this.state.obstacles = ground.state.objects;

        // scenery
        const scenery = new Background(this);
        this.add(scenery);

        // Basic keyboard controls - should these be in the avatar constructor?
        function handleKeyDown(event) {
            if (event.key == "ArrowLeft") {
                avatar.move = true;
                avatar.left = true;
                avatar.right = false;
            } else if (event.key == "ArrowRight") {
                avatar.move = true;
                avatar.left = false;
                avatar.right = true
            } else if (event.keyCode === 87) {
                avatar.useWater();
                return;
            } else if (event.keyCode === 70) {
                avatar.useFire();
                return;
            } else {
                return;
            }
            avatar.moveAvatar();
        };
        window.addEventListener('keydown', handleKeyDown, false);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList, obstacles } = this.state;
        
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, obstacles);
        }
    }
}

export default GameScene;
