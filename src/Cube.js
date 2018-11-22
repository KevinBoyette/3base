'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import MeshObject from './MeshObject';

export default class Cube extends MeshObject {

  constructor(scene, x, y, z, texture, scale=1, mass=1){
    let material = new THREE.MeshPhongMaterial({ map: texture });
    let mesh = new THREE.Mesh(new THREE.BoxGeometry( scale, scale, scale ), material);
    super(scene, x, y, z, mesh, scale, mass);
    if(this.scene.physicsEnabled)
    this.initPhysics(new CANNON.Box(new CANNON.Vec3(this.scale*0.5, this.scale*0.5, this.scale*0.5)) );
  }

}
