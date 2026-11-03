import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeScene } from './scene.service';

@Injectable({ providedIn: 'root' })
export class ShapesService {
  private readonly clock = new THREE.Clock();

  createCube(): THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    return cube;
  }

  // animate(
  //   environment: ThreeScene,
  //   shape?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>,
  // ): void {
  //   if (shape) {
  //     const delta = this.clock.getDelta();
  //     shape.rotation.y += 1 * delta;
  //     shape.rotation.x += 1 * delta;
  //   }

  //   environment.renderer.render(environment.scene, environment.camera);
  // }
}
