import { Group, SpotLight, AmbientLight, HemisphereLight, DirectionalLight } from 'three';

class GameLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        // const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        // const ambi = new AmbientLight(0x404040, 1.32);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        // dir.position.set(5, 1, 2);
        // dir.target.position.set(0, 0, 0);

        // this.add(ambi, hemi, dir);

        var hemi = new HemisphereLight(0xfffafa, 0x000000, .9);
        // scene.add(hemisphereLight);
        var sun = new DirectionalLight(0xcdc1c5, 0.9);
        // where to point the light so it's pointing behind the avatar?
        sun.position.set(3, 10, 10);
        sun.castShadow = true;
        // scene.add(sun);

        // Set up shadow properties for the sun light
        sun.shadow.mapSize.width = 256;
        sun.shadow.mapSize.height = 256;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 50 ;

        this.add(hemi, sun);
    }
}

export default GameLights;
