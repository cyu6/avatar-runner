import * as Dat from 'dat.gui';
import { Scene, Color, FogExp2, AudioListener, Audio, AudioLoader } from 'three';
import { Ground, Avatar, Background, Earthbend, Gap } from 'objects';
import { GameLights } from 'lights';
import game from '../../game';

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            // rotationSpeed: 1,
            updateList: [],
            oldObstacles: [],
            obstacles: [],
            nextObstacles: [],
            oldGround: null,
            ground: null,
            nextGround: null,
        };

        // Set background and fog
        this.background = new Color(0xf0fff0);
        this.fog = new FogExp2(0xf0fff0, 0.07);

        // Add lights to scene
        const lights = new GameLights();
        this.add(lights);

        // Avatar
        const avatar = new Avatar(this);
        this.add(avatar);

        // "infinite" plane
        const ground = new Ground(this);
        this.add(ground);
        this.state.obstacles = ground.state.objects;
        this.state.ground = ground;
        ground.add(new Gap(ground));

        // scenery
        const scenery = new Background(this);
        this.add(scenery);

        // Avatar keyboard controls 
        function handleKeyDown(event) {
            if (event.key == "ArrowLeft") {
                avatar.moveLeft = true;
                avatar.moveRight = false;
            } else if (event.key == "ArrowRight") {
                avatar.moveLeft = false;
                avatar.moveRight = true;
            } else if (event.keyCode === 87) {
                avatar.useWater();
                return;
            } else if (event.keyCode === 70) {
                avatar.useFire();
                return;
            } else if (event.keyCode === 65) {
                avatar.useAir();
                return;
            } else if (event.keyCode === 69) {
                avatar.useEarth();
                return;
            } else if (event.keyCode === 84) {
                avatar.tpose();
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

    removeObject(object) {
        const index = this.state.updateList.indexOf(object);
        if (index > -1) this.state.updateList.splice(index, 1);
        this.remove(object);
        // Remove firebending, waterbending, earthbending textures
    }

    resetScene() {
        let first = false;
        let obj = 0;
        while (this.children.length > 4) {
            if (this.children[obj] instanceof GameLights) {
                obj++;
                continue;
            }
            else if (this.children[obj] instanceof Background) {
                obj++;
                continue;
            }
            else if (this.children[obj] instanceof Avatar) {
                this.children[obj].position.set(0, 0.5, 6);
                this.children[obj].state.moveLeft = false;
                this.children[obj].state.moveRight = false;
                this.children[obj].running.play();
                this.children[obj].currentAction = this.children[obj].running;
                this.children[obj].currentlyAnimating = false;
                obj++;
            }
            else if (this.children[obj] instanceof Ground) {
                if (!first) {
                    const index = this.state.updateList.indexOf(this.children[obj]);
                    this.state.updateList.splice(index, 1);
                    let newGround = new Ground(this);
                    this.children[obj] = newGround;
                    this.state.obstacles = newGround.state.objects;
                    this.state.ground = newGround;
                    newGround.add(new Gap(newGround));
                    first = true;
                    obj++;
                }
                else {
                    this.removeObject(this.children[obj]);
                    this.state.nextGround = null;
                    this.state.nextObstacles = [];
                    this.state.oldGround = null;
                }
            }
            else {
                this.removeObject(this.children[obj]);
            }

        }
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this.state.obstacles);
            if (obj === this.state.ground) {
                // Ground switching
                if (obj.position.z >= 175) {
                    this.state.oldGround = this.state.ground;
                    this.state.ground = this.state.nextGround;
                    this.state.nextGround = null;
                }
                else if (obj.position.z > 20 && this.state.nextGround == null) {
                    const ground = new Ground(this);
                    ground.position.z = -135;
                    this.add(ground);
                    var gap = new Gap(ground);
                    ground.add(gap);
                    this.state.nextGround = ground;
                    this.state.nextObstacles = ground.state.objects;
                    this.removeObject(this.state.oldGround);
                    this.state.oldGround = null;
                }

                // Collect obstacles
                if (this.state.nextGround != null) {
                    this.state.nextObstacles = this.state.nextGround.state.objects;
                }
                if (this.state.oldGround != null) {
                    this.state.oldObstacles = this.state.oldGround.state.objects;
                }
                var temp = this.state.ground.state.objects.concat(this.state.nextObstacles);
                this.state.obstacles = this.state.oldObstacles.concat(temp);
            }
        }
    }
}

export default GameScene;
