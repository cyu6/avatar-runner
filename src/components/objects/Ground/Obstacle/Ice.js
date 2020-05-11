import { Group, TextureLoader, BoxBufferGeometry, MeshPhongMaterial, Mesh} from 'three';
import * as THREE from 'three';
import TEXTURE from '../../../../textures/Ice_002_COLOR.jpg';
import NORM from '../../../../textures/Ice_002_NORM.jpg';

class Ice extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
        };

        this.name = 'iceblock';

        var loader = new TextureLoader();

        // credits: https://3dtextures.me/2018/01/04/ice-002/
        var obsTexture = loader.load(TEXTURE, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var normTexture = loader.load(NORM, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var obsGeometry = new BoxBufferGeometry(5, 4, 0.25);
        var obsMaterial = new MeshPhongMaterial({ color: 0xc2e0f9, flatShading: true, 
                                                           map: obsTexture, normalMap: normTexture,
                                                           opacity: 0.8, specular: 0xffffff });
        var obs = new Mesh(obsGeometry, obsMaterial);
        obs.castShadow = true;
        obs.position.y = 2.2;
        obs.position.z = -10;
        this.add(obs);

        // Add self to parent's update list
        // parent.addToUpdateList(this);
        // parent.add(obs);
    }

    update(timeStamp) {

    }
}

export default Ice;
