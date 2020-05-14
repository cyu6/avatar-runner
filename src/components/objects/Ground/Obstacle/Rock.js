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
            bend: false,
        };

        this.name = 'rock';
        const radius = Math.random() + 0.3;
        var rockGeometry = new DodecahedronBufferGeometry(radius , 2);

        var loader = new TextureLoader();
        var rockTexture = loader.load(TEXTURE);
        var rockNormal = loader.load(NORMAL);
        var rockDisplacement = loader.load(DISP);
        var rockMaterial = new MeshStandardMaterial({map: rockTexture, normalMap: rockNormal, displacementMap: rockDisplacement, displacementScale: 0.5 * radius});
        var rock = new Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.position.x = (Math.random() - 0.5) * 3
        rock.position.y = radius + 1;
        rock.position.z = -10;
        this.add(rock);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {

        if (this.position.z > 10) {
            // delete element
            this.parent.removeObject(this);
        } 

        if (this.state.bend) {
            if (this.state.direction == 0) {
                this.position.x += 0.1;
            }
            else if (this.state.direction == 1) {
                this.position.x -= 0.1;
            }
        }
        this.position.z += 0.05;
    }
}

export default Rock;
