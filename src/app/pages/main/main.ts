import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { SceneService, ThreeScene } from './../../../../ui-kit/services/scene.service';
import { ShapesService } from './../../../../ui-kit/services/shapes.service';
import { LightService } from './../../../../ui-kit/services/light.service';
import { ModelService } from './../../../../ui-kit/services/model.service';
import * as THREE from 'three';

@Component({
  selector: 'main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements AfterViewInit, OnDestroy {
  private readonly sceneService = inject(SceneService);
  private readonly shapesService = inject(ShapesService);
  private readonly lightService = inject(LightService);
  private readonly modelService = inject(ModelService);
  private readonly sceneElement = viewChild.required<ElementRef<HTMLDivElement>>('scene');
  public environment = signal<ThreeScene | undefined>(undefined);

  prizes = ['10 Coins', 'Try Again', '50 Coins', 'Bonus Spin', '100 Coins'];
  result = '';
  spinning = false;

  onModelClick(wheel: THREE.Object3D<THREE.Object3DEventMap> | undefined): void {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const environment = this.environment();
    if (!environment) return;

    environment.renderer.domElement.addEventListener('click', (event) => {
      const bounds = environment.renderer.domElement.getBoundingClientRect();

      // Convert screen coordinates to Three.js normalized device coordinates
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(pointer, environment.camera);

      // Use true if the model has nested child meshes
      const hits = raycaster.intersectObject(environment.scene, true);

      if (hits.length > 0) {
        const clickedMesh = hits[0].object;

        console.log('Clicked:', clickedMesh.name);

        this.spinWheel(wheel);
      }
    });
  }

  animate(
    environment: ThreeScene,
    wheel: THREE.Object3D<THREE.Object3DEventMap> | undefined,
  ): void {
    environment.renderer.render(environment.scene, environment.camera);
  }

  loadModel(url: string, environment: ThreeScene): void {
    this.modelService.loadModel(
      url,
      (gltf) => {
        const wheel = gltf.scene.getObjectByName('Cylinder_1');

        if (wheel) {
          environment.renderer.setAnimationLoop(this.animate.bind(this, environment, wheel));
        }

        environment.scene.add(gltf.scene);
        this.sceneService.render(environment);

        this.onModelClick(wheel);
      },
      (_event) => {},
      (error) => {
        console.error(error);
      },
    );
  }

  spinWheel(wheel: THREE.Object3D<THREE.Object3DEventMap> | undefined): void {
    if (this.spinning || !wheel) return;

    this.spinning = true;
    this.result = '';

    const winningIndex = Math.floor(Math.random() * this.prizes.length);
    const fullCircle = Math.PI * 2;
    const segmentAngle = fullCircle / this.prizes.length;

    const startRotation = wheel.rotation.y;
    const fullTurns = 6;
    const prizeStart = winningIndex * segmentAngle;
    const prizeCenter = prizeStart + segmentAngle / 2;

    // Pointer is at top of the wheel
    const targetAngle = Math.PI / 2 - prizeCenter;

    // How far we need to move from current position to target position
    const difference = targetAngle - startRotation;

    // Keep that difference inside one circle: 0 up to 2π
    const extraRotation = ((difference % fullCircle) + fullCircle) % fullCircle;

    const endRotation = startRotation + fullTurns * fullCircle + extraRotation;

    const duration = 4000;
    const startTime = performance.now();

    const rotate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);

      wheel.rotation.y = startRotation + (endRotation - startRotation) * easeOut;

      if (progress < 1) {
        requestAnimationFrame(rotate);
      } else {
        wheel.rotation.y = endRotation;
        this.spinning = false;
        this.result = this.prizes[winningIndex];
      }
    };
    console.log('Spinning to prize:', this.prizes[winningIndex]);

    requestAnimationFrame(rotate);
  }

  ngAfterViewInit(): void {
    const element = this.sceneElement().nativeElement;
    const environment = this.sceneService.createEnvironment(
      element.getBoundingClientRect().width,
      element.getBoundingClientRect().height,
    );
    this.environment.set(environment);
    element.appendChild(environment.renderer.domElement);

    const pointLight = this.lightService.createPointLight(0, 2, 1);
    environment.scene.add(pointLight);

    this.loadModel('wheel.glb', environment);
  }

  ngOnDestroy(): void {}
}
