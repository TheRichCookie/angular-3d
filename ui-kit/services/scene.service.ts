import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

@Injectable({ providedIn: 'root' })
export class SceneService {
  createEnvironment(width: number, height: number): ThreeScene {
    const scene = this.createScene();
    const camera = this.createCamera(width, height);
    const renderer = this.createRenderer(width, height);

    return { scene, camera, renderer };
  }

  createCamera(width: number, height: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;
    camera.position.y = 1;
    return camera;
  }

  createRenderer(width: number, height: number): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    return renderer;
  }

  createScene(color: string = '#ffffff'): THREE.Scene<THREE.Object3DEventMap> {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(color);
    return scene;
  }

  render(environment: ThreeScene): void {
    environment.renderer.render(environment.scene, environment.camera);
  }

  // resize(width: number, height: number): void {
  //   if (width <= 0 || height <= 0) {
  //     return;
  //   }

  //   this.environment?.camera.aspect = width / height;
  //   this.environment?.camera.updateProjectionMatrix();
  //   this.environment?.renderer.setSize(width, height);
  // }
}
