'use-strict';

import Sky from '../Sky';
import Box from '../Box';
import Ball from '../Ball';
import Level from '../Level';
import Camera from '../Camera';
import * as THREE from 'three';
import Ground from '../Ground';
import Level2 from './Level2';
import { randNum } from '../Utils';

export default class Level1 extends Level {

  constructor(loader) {
    super(loader);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.manageLoaders();
    this.load();
  }

  click(){
    let direction = new THREE.Vector3();
    this.camera.controls.getDirection( direction );
    let pos = this.camera.controls.getObject().position;

    let spd = 150;
    let ball = new Ball(this,0, 0, 0, null, 1, 1000);
    ball.body.angularVelocity.set(0, 0, 0);
    ball.body.position.set(pos.x,pos.y,pos.z);
    ball.body.velocity.set(direction.x * spd, direction.y * spd, direction.z * spd);
    ball.body.addEventListener("sleep",(event)=>{
      ball.die();
    });
  }

  createScene(){

    new Sky(this, 0, 800, 0, '/sky.jpg', 10000);
    new Ground(this, 0, 0, 0, 'ground.jpg', 1000);

    this.buildTower(1, 1, 50, 1, 0);

    // var audio = new Audio('./assets/audio/wind.wav');
    // audio.play();
  }

  buildTower(length=5, width=1, height=20, scale=1, start=2){
    for (let x = -start; x < -start+length; x++) {
      for (let z = 0; z < width; z++) {
        for (let y = 0; y < height; y++) {
          let box = new Box(this, (x*scale), (0.5*scale)+(y*scale), z*scale, 'box/1.jpg', scale, 10);
          box.body.sleep();
        }
      }
    }
  }

  next(){
    this.die();
    this.loader.next(new Level2(this.loader));
  }

  extra(){
    this.buildTower();
  }

}
