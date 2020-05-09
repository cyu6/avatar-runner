import { Group, Object3D, Clock } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import MODEL from './files/mount.blend1.obj';
import MAT1 from './files/mount1.mtl';
import MAT2 from './files/mount2.mtl';

class Background extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        // idea for later: keep list of all added objects, delete the ones at the beginning when 2 new ones are added
        this.state = {
            obj: new Object3D(),
            obj2: new Object3D(),
            clock: new Clock(),
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
        mtlLoader.load(MAT1, (material) => {
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

        const nloader = new OBJLoader();
        const nmtlLoader = new MTLLoader();

        nmtlLoader.setResourcePath('src/components/objects/Background/files/');
        nmtlLoader.load(MAT2, (material) => {
            material.preload();
            nloader.setMaterials(material).load(MODEL, (obj) => {
              obj.position.x = -9;
              obj.position.y = -3;
              for (let child in obj.children) {
                  obj.children[child].scale.set(2, 2, 2);
              }
              this.state.obj2 = obj.clone();
            //   this.add(obj);
            });
          });

        // Add self to parent's update list
        parent.addToUpdateList(this);

    }

    randLook(obj) {
        let radians = Math.random() * 6.28;
        obj.rotateY(radians);
        let offset = Math.random() * 10 - 5;
        obj.position.x += offset;
    }

    update() {

        this.position.z += 0.02;

        const { obj, obj2, clock } = this.state;

        // Add another mountain
        if (clock.getElapsedTime() > 4.5) {
            clock.start();
            let index = Math.floor(Math.random() * 3 );
            if (index == 2) {
                // add a snowy mountain
                const new_obs = obj2.clone();
                new_obs.position.z = new_obs.position.z - this.position.z - 3;
                const clone = obj.clone();
                clone.position.z = clone.position.z - this.position.z - 3;
                let side = Math.floor(Math.random() * 2);
                if (side == 0) {
                    new_obs.position.x = 8;
                } else {
                    clone.position.x = 8;
                    this.randLook(clone);
                }
                this.add(new_obs);
                this.add(clone);
                return;
            }
            const new_obs = obj.clone();
            new_obs.position.z = new_obs.position.z - this.position.z - 3;
            this.randLook(new_obs);
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
