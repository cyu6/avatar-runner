import { Group, SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Ice } from '../../Ground/Obstacle';
// import MODEL from './comet.obj';

class Fire extends Group {
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
        this.name = 'firebend';

        var geometry = new SphereGeometry(0.2);

        var fireTexture = new THREE.TextureLoader().load( 'src/components/objects/Avatar/Fire/second.png' );
        var animated = new TextureAnimator( fireTexture, 6, 5, 30, 60 ); // texture, #horiz, #vert, #total, duration.
        this.state.animated = animated;
        var material = new MeshBasicMaterial( {color: 0xffffff, map: fireTexture, side: THREE.DoubleSide} );

        var sphere = new Mesh( geometry, material );
        sphere.position.y = 1;
        this.add( sphere );

        // loader.load(MODEL, (obj) => {
        //     this.add(obj);
        // });


        parent.addToUpdateList(this);

    }
    
    // handleCollision() {
    //     debugger
    //     var mesh = this.children[0];
    //     var originPoint = mesh.position.clone();
    //     for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++) {   
    //         var localVertex = mesh.geometry.vertices[vertexIndex].clone();
    //         var globalVertex = localVertex.applyMatrix4( mesh.matrix );
    //         var directionVector = globalVertex.sub( originPoint );
    //         var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
    //         var collisionResults = ray.intersectObjects( collidableMeshList );
    //         // debugger
    //         if ( collisionResults.length > 0)  {
    //             // debugger
    //             // hit = true;
    //         }
    //     } 
    // }   

    handleCollisions(obstacles)  {

        // debugger
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
                // console.log("hit");
                // debugger
                obstacles[obs].visible = false;
                this.visible = false;
                this.parent.removeFromUpdateList(this);
                return;
            }            
        }
    }

    update(timeStamp, obstacles) {

        const { clock, animated } = this.state;
        var delta = clock.getDelta(); 
        animated.update(1000 * delta);

        // NOTE:: fire ball moves along with the avator. might want to change this!
        this.position.z -= 0.04;

        this.handleCollisions(obstacles);
      
        
    }
}

export default Fire;
