'use-strict';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import SceneObject from './SceneObject';

export default class MeshObject extends SceneObject {

  constructor(scene, x=0, y=0, z=0, mesh, scale=1, mass=0){
    super(scene, x, y, z, mesh)
    this.mass = mass;
    this.scale = scale;
    this.configMesh();
  }

  configMesh(){
    if (this.threeObject === null) { return }
    this.threeObject.position.set(this.x, this.y, this.z);
    this.threeObject.castShadow = true;
    this.threeObject.side = THREE.DoubleSide;
    this.threeObject.receiveShadow = true;
  }

  initPhysics(shape){
    new Promise ((resolve, reject) => {
      try{
        this.body = new CANNON.Body({
          mass: this.mass
        });
        this.body.addShape(shape);
        this.body.position.set(this.x,this.y,this.z);
        this.body.angularVelocity.set(0,0,0);
        this.body.angularDamping = 0.7;
        this.body.allowSleep = true;
        this.body.sleepSpeedLimit = 0.01; // Body will feel sleepy if speed < n (speed == norm of velocity)
        this.body.sleepTimeLimit = 0.5; // Body falls asleep after n seconds of sleepiness
        this.scene.world.addBody(this.body);
        resolve();
      }catch (e) {
        reject(e);
      }
    });
  }

  setRotation(x=0.0, y=0.0, z=0.0, w=0.0){
    let quat = new AMMO.btQuaternion(x,y,z,w);
    this.body.getCenterOfMassTransform(this.transform);
    this.transform.setRotation(quat);
    this.body.setCenterOfMassTransform(this.transform);
  }

  addPositionalAudio(fileName = "", dist = 1){
    let audio = this.scene.getPositionalAudio(fileName, dist)
    this.threeObject.add(audio);
  }

  die(){
    this.scene.scene.remove(this.threeObject);
    this.scene.removeBodies.push(this.body);
    // this.scene.world.removeBody(this.body)
  }

}
