import { Group } from 'three';
import { ParticleEngine } from '../../engine';
import * as THREE from 'three';
import { Ice } from '../Ground/Obstacle';
import PARTICLE from '../../../images/smokeparticle.png';

class Firebend extends Group {
    constructor(parent, xpos) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            engine: null,
            distance: 0,
        };

        this.name = 'firebend';
        var Type = Object.freeze({ "CUBE":1, "SPHERE":2 });

        class Tween {
            constructor(timeArray, valueArray) {
                this.times = timeArray || [];
                this.values = valueArray || [];
            }
            lerp(t) {
                var i = 0;
                var n = this.times.length;
                while (i < n && t > this.times[i])
                    i++;
                if (i == 0)
                    return this.values[0];
                if (i == n)
                    return this.values[n - 1];
                var p = (t - this.times[i - 1]) / (this.times[i] - this.times[i - 1]);
                if (this.values[0] instanceof THREE.Vector3)
                    return this.values[i - 1].clone().lerp(this.values[i], p);
                else // its a float
                    return this.values[i - 1] + p * (this.values[i] - this.values[i - 1]);
            }
        }

        var settings = {
            positionStyle  : Type.SPHERE,
            positionBase   : new THREE.Vector3( 0, 0, 0),
            positionRadius : 0.1,
              
            velocityStyle : Type.SPHERE,
            speedBase     : 1,
            speedSpread   : 0,
            
            particleTexture : new THREE.TextureLoader().load( PARTICLE ),
      
            sizeTween    : new Tween( [0,4], [0,10] ),
            opacityTween : new Tween( [0, 0.3], [1, 1] ),
            colorBase    : new THREE.Vector3(0.02, 1, 0.4),
            blendStyle   : THREE.AdditiveBlending,  
            
            particlesPerSecond : 5000,
            particleDeathAge   : 0.7,  
            emitterDeathAge    : 60
        };

        // try to make visuals more appealing

        this.state.engine = new ParticleEngine();
        this.state.engine.setValues( settings );
        this.add(this.state.engine.initialize());

        this.position.z = 5;
        this.position.y = 1;
        this.position.x = xpos;

        this.state.distance = this.position.z;

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
            if (collision && (obstacles[obs] instanceof Ice)) {
                obstacles[obs].parent.removeObject(obstacles[obs]);
                this.parent.removeObject(this);
                return;
            }            
        }
    }

    update(timeStamp, obstacles) {
        this.state.engine.update( 0.01 * 0.5 );
        if (this.state.distance - this.position.z > 6) {
            // delete element
            this.parent.removeObject(this);
        }
        this.position.z -= 0.04;
        this.handleCollisions(obstacles);
    }
}

export default Firebend;
