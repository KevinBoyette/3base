'use-strict';

import * as THREE from 'three';
import MeshObject from './MeshObject';

export default class GLTFModel extends MeshObject {

  constructor(scene, x, y, z, model, scale=1, mass=1){
    super(scene, x, y, z, null, scale, mass);
    this.model = model;
    return this.loadGLTF()
  }

  loadGLTF(){
    return new Promise((resolve, reject) => {
      this.scene.manager.glTFLoader.load(
        this.model + '/scene.gltf',
        ( gltf ) => {
          try{
            this.gltf = gltf;
            this.threeObject = gltf.scene;
            gltf.scene.position.set(this.x, this.y, this.z);
            gltf.scene.traverse( node => {
              if ( node instanceof THREE.Mesh ){
                if (this.gltf.animations.length > 0) {
                  gltf.scene.scale.set(this.scale,this.scale,this.scale);
                }else{
                  node.geometry.scale(this.scale, this.scale, this.scale)
                }
                node.castShadow = true;
                node.receiveShadow = true;
                node.side = THREE.DoubleSide;
              }
            });
            resolve(this);
         }catch(e){
          reject(e);
         }
        },
        (xhr) => {// on Load
          let percentLoaded = ( xhr.loaded / xhr.total * 100 )
          console.log( this.model + " " + percentLoaded + '% loaded' );
        },
        (e) => {// on Error
          console.log(e);
        }
      )
    });
  }

  initPhysics(){
    let bbox;
    this.gltf.scene.traverse( node => {
      if ( node instanceof THREE.Mesh ){
        geometry = new THREE.Geometry().fromBufferGeometry( node.geometry );
        geometry.computeBoundingBox();
        bbox
      }
    });
    let box = new CANNON.Box(new CANNON.Vec3(
      (box.max.x - box.min.x) / 2,
      (box.max.y - box.min.y) / 2,
      (box.max.z - box.min.z) / 2
    ));
    this.initPhysics();
  }

  playAnimation(aNum = 0){
    if( this.gltf.animations.length > 0){
      this.mixer = new THREE.AnimationMixer(this.gltf.scene);
      this.mixer.clipAction(this.gltf.animations[aNum]).play();
    }
  }
}
