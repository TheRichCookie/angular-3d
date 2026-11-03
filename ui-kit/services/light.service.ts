import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })
export class LightService {
  createAmbientLight(): THREE.AmbientLight {
    return new THREE.AmbientLight(0xffffff, 1);
  }

  createDirectionalLight(x: number, y: number, z: number): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(x, y, z);
    return light;
  }

  createPointLight(x: number, y: number, z: number): THREE.PointLight {
    const light = new THREE.PointLight(0xffffff, 3, 6);
    light.position.set(x, y, z);
    return light;
  }
}
