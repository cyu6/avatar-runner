import { Group } from 'three';
import * as THREE from 'three';

class Gap extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
        };

        this.name = 'gap';
        var planeGeometry = new THREE.PlaneBufferGeometry(7, 2);
        var planeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        this.add(plane);
        parent.state.objects.push(this);

        this.position.z = -75;

        // Add self to parent's update list
        // parent.addToUpdateList(this);
        // parent.add(obs);

    }

    update(timeStamp) {

    }
}

export default Gap;
