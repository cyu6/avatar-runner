import { Group} from 'three';
import * as THREE from 'three';
import { Rock } from '../Ground/Obstacle';

class Airbend extends Group {
    constructor(parent, xpos) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            x: xpos,
        };

        // Maybe add air sprite later?
        this.name = 'airbend';
        parent.addToUpdateList(this);
    }

    handleCollisions(obstacles)  {
        for (var obs in obstacles) {
            if (obstacles[obs] instanceof Rock) {
                if (this.state.x <= 0) {
                    obstacles[obs].state.direction = 0;
                }
                else {
                    obstacles[obs].state.direction = 1;
                }
                obstacles[obs].state.bend = true;
                this.parent.removeObject(this);
                return;
            }            
        }
    }

    update(timeStamp, obstacles) {
        this.handleCollisions(obstacles);
    }
}

export default Airbend;
