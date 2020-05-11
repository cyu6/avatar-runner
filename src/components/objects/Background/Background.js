import { Group, Object3D, Clock, PlaneBufferGeometry, MeshStandardMaterial, Mesh } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import MODEL from './files/mount.blend1.obj';
import MAT1 from './files/mount1.mtl';
import MAT2 from './files/mount2.mtl';

// https://3dtextures.me/2018/02/27/snow-002/

class Background extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            obj: new Object3D(),
            obj2: new Object3D(),
            clock: new Clock(),
            // river: null,
        };

        // var planeGeometry = new PlaneBufferGeometry(7, 200, 7, 200);
        // var planeMaterial = new MeshStandardMaterial({ color: 0x0000ff });
        // var plane = new Mesh(planeGeometry, planeMaterial);
        // plane.position.set(0, -3.5, 0);
        // plane.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
        // this.add(plane);
        // this.state.river = plane;

        this.name = 'background';

        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        loader.setMaterials(mtlLoader.parse(MAT1)).load(MODEL, (obj) => {
            obj.position.x = -9;
            obj.position.y = -4;
            for (let child in obj.children) {
                obj.children[child].scale.set(2, 2, 2);
            }
            let clone = obj.clone();
            clone.position.x = 8;
            this.add(obj);
            this.add(clone);
            this.state.obj = obj.clone();
        });

        const nloader = new OBJLoader();
        const nmtlLoader = new MTLLoader();
        nloader.setMaterials(nmtlLoader.parse(MAT2)).load(MODEL, (obj) => {
            obj.position.x = -9;
            obj.position.y = -3;
            for (let child in obj.children) {
                obj.children[child].scale.set(2, 2, 2);
            }
            this.state.obj2 = obj.clone();
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
        if (clock.getElapsedTime() > 4) {
            clock.start();
            let index = Math.floor(Math.random() * 3 );
            if (index == 2) {
                // add a snowy mountain
                const new_obs = obj2.clone();
                new_obs.position.z = new_obs.position.z - this.position.z - 5;
                const clone = obj.clone();
                clone.position.z = clone.position.z - this.position.z - 5;
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
            new_obs.position.z = new_obs.position.z - this.position.z - 5;
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
