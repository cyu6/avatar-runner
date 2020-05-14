import { SphereBufferGeometry, Mesh, MeshBasicMaterial, Group} from 'three';
import { Rock } from '../Ground/Obstacle';

class Airbend extends Group {
    constructor(parent, xpos) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            x: xpos,
            distance: 0,
        };

        // Maybe add air sprite later?
        this.name = 'airbend';

        var geometry = new SphereBufferGeometry(0.5);
        var material = new MeshBasicMaterial({ transparent: true, opacity: 0 });
        var air = new Mesh(geometry, material);

        this.position.z = 4;
        this.position.y = 2;
        this.position.x = xpos;
        this.state.distance = this.position.z;

        this.add(air);

        parent.addToUpdateList(this);
    }

    handleCollisions(obstacles)  {

        var mesh = this.children[0];
        
        function detectBoxCollision(object1, object2) {
            object1.geometry.computeBoundingBox(); 
            object2.geometry.computeBoundingBox();
            object1.updateMatrixWorld();
            object2.updateMatrixWorld();
            
            var box1 = object1.geometry.boundingBox.clone();
            box1.applyMatrix4(object1.matrixWorld);
    
            var box2 = object2.geometry.boundingBox.clone();
            box2.applyMatrix4(object2.matrixWorld);
    
            return box1.intersectsBox(box2);
        }

        for (var obs in obstacles) {
            var collision = detectBoxCollision(obstacles[obs].children[0], mesh);
            if (collision && (obstacles[obs] instanceof Rock)) {
                if (this.state.x <= 0) {
                    obstacles[obs].state.direction = 0;
                }
                else {
                    obstacles[obs].state.direction = 1;
                }
                // console.log("AIR HIT ", obstacles[obs]);
                obstacles[obs].state.bend = true;
                this.parent.removeObject(this);
                return;
            }            
        }
    }

    update(timeStamp, obstacles) {
        if (this.state.distance - this.position.z > 6) {
            // delete element
            this.parent.removeObject(this);
        }
        this.position.z -= 0.04;
        this.handleCollisions(obstacles);
    }
}

export default Airbend;
