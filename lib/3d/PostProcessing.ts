import * as THREE from '@three';
import { EffectComposer } from '@three/EffectComposer';
import { RenderPass } from '@three/RenderPass';
import { UnrealBloomPass } from '@three/UnrealBloomPass';
import { SSAOPass } from '@three/SSAOPass';

export const PostProcessing = {
  setup(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(window.innerWidth, window.innerHeight),
    //   0.7,
    //   0.4,
    //   0.85
    // );
    // composer.addPass(bloomPass);

    // const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
    // composer.addPass(ssaoPass);

    return composer;
  },
};