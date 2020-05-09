import { Group } from 'three';
import '../../engine/ParticleEngine';

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

        this.state.engine = new ParticleEngine();

        var settings = {
            positionStyle  : Type.SPHERE,
            positionBase   : new THREE.Vector3( 0, 0, 1 ),
            positionRadius : 0.5,
              
            velocityStyle : Type.SPHERE,
            speedBase     : 1,
            speedSpread   : 0,
            
            particleTexture : THREE.ImageUtils.loadTexture( 'src/images/smokeparticle.png' ),
      
            sizeTween    : new Tween( [0,4], [0,10] ),
            opacityTween : new Tween( [0, 0.3], [1, 1] ),
            colorBase    : new THREE.Vector3(0.02, 1, 0.4),
            blendStyle   : THREE.AdditiveBlending,  
            
            particlesPerSecond : 5000,
            particleDeathAge   : 0.7,  
            emitterDeathAge    : 60
        };

        this.state.engine = new ParticleEngine();
        this.state.engine.setValues( settings );
        this.add(this.state.engine.initialize());

        parent.addToUpdateList(this);

    }

    update(timeStamp) {
        this.state.engine.update( 0.01 * 0.5 );
    }
}

export default Firebend;
