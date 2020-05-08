import { Group, Object3D, Clock } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import MODEL from './files/mount.blend1.obj';
import MAT from './files/mount.blend1.mtl';

class Background extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        // idea for later: keep list of all added objects, delete the ones at the beginning when 2 new ones are added
        this.state = {
            obj: new Object3D(),
            clock: new Clock(),
            left: true,
        };

        // Moving plane
        // this.name = 'scenery_plane';
        // var planeGeometry = new PlaneBufferGeometry(100, 100);
        // var planeMaterial = new MeshStandardMaterial({ color: 0x909A94 });
        // var plane = new Mesh(planeGeometry, planeMaterial);
        // plane.position.set(0, -3, 0);
        // plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
        // this.add(plane);
        // this.state.plane = plane;

        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        this.name = 'background';
        mtlLoader.setResourcePath('src/components/objects/Background/files/');
        mtlLoader.load(MAT, (material) => {
          material.preload();
          loader.setMaterials(material).load(MODEL, (obj) => {
            obj.position.x = -9;
            obj.position.y = -3;
            for (let child in obj.children) {
                obj.children[child].scale.set(2, 2, 2);
            }
            let clone = obj.clone();
            clone.position.x = 8;
            this.add(obj);
            this.add(clone);
            this.state.obj = obj.clone();
          });
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

    }

    update() {

        this.position.z += 0.02;

        const { obj, clock } = this.state;
        
        // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }

        // Add another mountain
        if (clock.getElapsedTime() > 4) {
            clock.start();
            const new_obs = obj.clone();
            new_obs.position.z = new_obs.position.z - this.position.z - 3;
            let clone = new_obs.clone();
            clone.position.x = 8;
            this.add(new_obs);
            this.add(clone);
        }
    }
}

// previous Material
// Ns 96.078431
// Ka 0.000000 0.000000 0.000000
// Kd 0.050977 0.050977 0.050977
// Ks 0.001641 0.001641 0.001641
// Ni 1.000000
// d 1.000000
// illum 2

export default Background;
