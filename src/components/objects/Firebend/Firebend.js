import { Group } from 'three';
// import '../../engine/ParticleEngine';
import { ParticleEngine } from '../../engine';
import * as THREE from 'three';

class Firebend extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            // gui: parent.state.gui,
            // bob: true,
            // spin: this.spin.bind(this),
            // twirl: 0,
            engine: null,
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


        // this.state.engine = new ParticleEngine();

        var settings = {
            positionStyle  : Type.SPHERE,
            positionBase   : new THREE.Vector3( 0, 0, 0),
            positionRadius : 0.1,
              
            velocityStyle : Type.SPHERE,
            speedBase     : 1,
            speedSpread   : 0,
            
            particleTexture : new THREE.TextureLoader().load( 'src/images/smokeparticle.png' ),
      
            sizeTween    : new Tween( [0,4], [0,10] ),
            opacityTween : new Tween( [0, 0.3], [1, 1] ),
            colorBase    : new THREE.Vector3(0.02, 1, 0.4),
            blendStyle   : THREE.AdditiveBlending,  
            
            particlesPerSecond : 5000,
            particleDeathAge   : 0.7,  
            emitterDeathAge    : 60
        };

        // to do : Figure out bounding box + do collisions
        // also try to make visuals more appealing

        this.state.engine = new ParticleEngine();
        this.state.engine.setValues( settings );
        this.add(this.state.engine.initialize());

        this.position.z = 5;
        this.position.y = 1;
        this.position.x = 0;

        
        parent.addToUpdateList(this);

    }

    update(timeStamp) {
        // debugger
        this.state.engine.update( 0.01 * 0.5 );
        // this.position.z -= 0.04;
    }
}

export default Firebend;
