import { Group, DodecahedronBufferGeometry, TextureLoader, MeshStandardMaterial, Mesh } from 'three';
import TEXTURE from '../../../../textures/ground.jpg';
import NORMAL from '../../../../textures/ground_normal.jpg';
import DISP from '../../../../textures/ground_displacement.png';

class Rock extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            distance: 0,
            bend: false,
            direction: 0,
        };

        this.name = 'rock';
        const radius = 1.2
        var rockGeometry = new DodecahedronBufferGeometry(radius , 2);

        var loader = new TextureLoader();
        var rockTexture = loader.load(TEXTURE);
        var rockNormal = loader.load(NORMAL);
        var rockDisplacement = loader.load(DISP);
        var rockMaterial = new MeshStandardMaterial({map: rockTexture, normalMap: rockNormal, displacementMap: rockDisplacement, displacementScale: 0.5});
        var rock = new Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.position.y = radius;
        rock.position.z = -5;
        this.state.distance = rock.position.z;
        this.add(rock);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {

        if (this.position.z - this.state.distance > 15) {
            // delete element
            this.parent.removeObject(this);
        }

        if (this.state.bend) {
            if (this.state.direction == 0) {
                this.position.x += 0.08;
            }
            else if (this.state.direction == 1) {
                this.position.x -= 0.08;
            }
        }
        this.position.z += 0.08;
    }
}

export default Rock;
