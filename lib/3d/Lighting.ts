import * as THREE from '@three';
import { RGBELoader } from '@three/RGBELoader';

export const Lighting = {
  setup(scene: THREE.Scene, hdrUrl: string) {
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.5);
    directional.position.set(10, 10, 10);
    directional.castShadow = true;
    scene.add(directional);

    new RGBELoader().load(hdrUrl, (texture:  THREE.Texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = texture;
    });
  },
};