'use-strict';

import * as THREE from 'three';
import {
  Body, 
  Plane,
  Vec3
} from 'cannon';
import MeshObject from './MeshObject';

export default class Ground extends MeshObject {

  constructor(scene, texture, scale=1000){
    if(texture){
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 30, 30 );
    }
    let material = new THREE.MeshPhongMaterial({ map: texture });
    let mesh = new THREE.Mesh(new THREE.PlaneGeometry(scale, scale), material);
    super(scene, 0,0,0, mesh);
    this.threeObject.material.shininess = 0;
    this.threeObject.rotation.x = -Math.PI/2;
    this.threeObject.castShadow = false;
    this.threeObject.receiveShadow = true;
    if(this.scene.physicsEnabled)
      this.initPhysics();
  }

  initPhysics(){
    this.body = new Body({ mass: 0 });
    let groundShape = new Plane();
    this.body.addShape(groundShape);
    this.body.quaternion.setFromAxisAngle(new Vec3(1,0,0),-Math.PI/2);
    this.body.position.set(0, 0, 0);
    this.scene.world.addBody(this.body);
  }

  update(){}

}
