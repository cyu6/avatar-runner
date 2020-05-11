import { Group, SpotLight, AmbientLight, HemisphereLight, DirectionalLight } from 'three';

class GameLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        var hemi = new HemisphereLight(0xffffff, 0xffffff, 0.7);
        hemi.position.set(0, 500, 0);
        var sun = new DirectionalLight(0xcdc1c5, 0.9);
        // where to point the light so it's pointing behind the avatar?
        sun.position.set(10, 20, 20);
        sun.castShadow = true;

        // Set up shadow properties for the sun light
        sun.shadow.mapSize.width = 256;
        sun.shadow.mapSize.height = 256;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 50 ;

        this.add(hemi, sun);
    }
}

export default GameLights;
