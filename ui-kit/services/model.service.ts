import { Injectable } from '@angular/core';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

@Injectable({ providedIn: 'root' })
export class ModelService {
  private readonly loader = new GLTFLoader();

  loadModel(
    url: string,
    onSuccess: (gltf: GLTF) => void,
    onProgress: (event: ProgressEvent<EventTarget>) => void,
    onError: (error: unknown) => void,
  ): void {
    this.loader.load(url, onSuccess, onProgress, onError);
  }
}
