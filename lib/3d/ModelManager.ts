import * as THREE from '@three';
import { GLTFLoader } from '@three/GLTFLoader';
import { Result } from '../Result.ts';

export const ModelManager = {
  async loadModel(scene: THREE.Scene, url: string): Promise<Result<THREE.Group>> {
    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(url);
      const model = gltf.scene;
      model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            roughness: 0.5,
            metalness: 0.5,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
      return { ok: true, value: model };
    } catch (error) {
      return { ok: false, error: `Failed to load model: ${error}` };
    }
  },
};