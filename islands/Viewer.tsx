import { useEffect, useRef } from "preact/hooks";
import * as THREE from "@three";
import { OrbitControls } from "@three/OrbitControls";
import { GLTFLoader } from "@three/GLTFLoader";
import { RGBELoader } from "@three/RGBELoader";
import { EffectComposer } from "@three/EffectComposer";
// import { RenderPass } from '@three/RenderPass';
// import { UnrealBloomPass } from '@three/UnrealBloomPass';
// import { SSAOPass } from '@three/SSAOPass';
import { SceneSetup } from "../lib/3d/SceneSetup.ts";
import { Lighting } from "../lib/3d/Lighting.ts";
import { PostProcessing } from "../lib/3d/PostProcessing.ts";
import { ModelManager } from "../lib/3d/ModelManager.ts";
import { DeviceDetection } from "../lib/3d/DeviceDetection.ts";
// import { translate } from "../lib/translations.ts";

export function ViewerIsland() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Device detection
        if (!DeviceDetection.isWebGLSupported()) {
            // alert(translate("errors.no_webgl"));
            return;
        }
        if (DeviceDetection.isLowEndDevice()) {
            // alert(translate("errors.low_end_device"));
            return;
        }

        // Scene setup
        const { scene, camera, renderer } = SceneSetup.setup(canvasRef.current);
        sceneRef.current = scene;

        // Lighting
        // Lighting.setup(scene, "https://cdn.your-cdn.bunny.net/hdr/forest.hdr");
        Lighting.setup(scene, "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/abandoned_greenhouse_1k.hdr");

        // Post-processing
        composerRef.current = PostProcessing.setup(scene, camera, renderer);

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener(
            "change",
            () => renderer.render(scene, camera),
        );

        // Load initial model
        // ModelManager.loadModel(scene, "/api/model/default");
        ModelManager.loadModel(scene, "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf");

        // Animation loop
        const animate = () => {
            const start = performance.now();
            composerRef.current?.render();
            const duration = performance.now() - start;
            if (duration > 100) {
                // alert(translate("errors.slow_render"));
            }
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                // zIndex: 2,
                // display: "block",
            }}
        />
    );
}
