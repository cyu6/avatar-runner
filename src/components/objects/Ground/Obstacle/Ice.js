import { Group, TextureLoader, BoxBufferGeometry, MeshPhongMaterial, Mesh} from 'three';
import * as THREE from 'three';
import TEXTURE from '../../../../textures/Ice_001_COLOR.jpg';
import NORMAL from '../../../../textures/Ice_001_NRM.jpg';
import DISPLACEMENT from '../../../../textures/Ice_001_DISP.png';
import SPECULAR from '../../../../textures/Ice_001_SPEC.jpg';

class Ice extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
        };

        this.name = 'iceblock';

        var loader = new TextureLoader();

        // credits: https://3dtextures.me/2018/01/04/ice-001/
        var obsTexture = loader.load(TEXTURE, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var normTexture = loader.load(NORMAL, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });


        var displacement = loader.load(DISPLACEMENT, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var specular = loader.load(SPECULAR, function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.repeat.set(3, 2);
        });

        var obsGeometry = new BoxBufferGeometry(5, 4, 0.25, 50, 40);
        var obsMaterial = new MeshPhongMaterial({color: 0xbddeec, flatShading: true, map: obsTexture, normalMap: normTexture,
                                                       displacementMap: displacement, displacementScale: 0.1, specularMap: specular,
                                                       opacity: 0.7, });
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
