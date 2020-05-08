import { Group, SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import MODEL from './comet.obj';

class Water extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // const loader = new OBJLoader();

        this.state = {
            clock: new THREE.Clock(),
            animated: null,
        };

        // source: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Texture-Animation.html
        class TextureAnimator {
            constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
                this.tilesHorizontal = tilesHoriz;
                this.tilesVertical = tilesVert;
                // how many images does this spritesheet contain?
                //  usually equals tilesHoriz * tilesVert, but not necessarily,
                //  if there at blank tiles at the bottom of the spritesheet. 
                this.numberOfTiles = numTiles;
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
                // how long should each image be displayed?
                this.tileDisplayDuration = tileDispDuration;
                // how long has the current image been displayed?
                this.currentDisplayTime = 0;
                // which image is currently being displayed?
                this.currentTile = 0;
                this.update = function (milliSec) {
                    this.currentDisplayTime += milliSec;
                    while (this.currentDisplayTime > this.tileDisplayDuration) {
                        this.currentDisplayTime -= this.tileDisplayDuration;
                        this.currentTile++;
                        if (this.currentTile == this.numberOfTiles)
                            this.currentTile = 0;
                        var currentColumn = this.currentTile % this.tilesHorizontal;
                        texture.offset.x = currentColumn / this.tilesHorizontal;
                        var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
                        texture.offset.y = currentRow / this.tilesVertical;
                    }
                };
            }
        }

        this.state.clock.start();
        this.name = 'waterbend';

        var geometry = new SphereBufferGeometry(0.2);

        var waterTexture = new THREE.TextureLoader().load( 'src/components/objects/Avatar/Water/water.png' );
        var animated = new TextureAnimator( waterTexture, 10, 3, 30, 120 ); // texture, #horiz, #vert, #total, duration.
        this.state.animated = animated;
        var material = new MeshBasicMaterial( {color: 0xffffff, map: waterTexture, side: THREE.DoubleSide} );

        var sphere = new Mesh( geometry, material );
        sphere.position.y = 1;
        this.add( sphere );

        // loader.load(MODEL, (obj) => {
        //     this.add(obj);
        // });


        parent.addToUpdateList(this);

    }

    update() {

        const { clock, animated } = this.state;
        var delta = clock.getDelta(); 
        animated.update(1000 * delta);

        this.position.z -= 0.04;
        
    }
}

export default Water;
