import { error, ok, Result } from "../Result.ts";

// deno-lint-ignore-file no-window
export const DeviceDetection = {
    isWebGLSupported(): Result<boolean> {
        try {
            const canvas = document.createElement("canvas");
            const r = !!(
                self.WebGLRenderingContext &&
                (canvas.getContext("webgl") ||
                    canvas.getContext("experimental-webgl"))
            );
            if (!r) {

                const message = "WebGL is not supported on this device.";
                return error(message)
            }
            return ok(r);
        }
        catch (e) {
            const err = e as Error;
            const message = `Error checking WebGL support: ${err.message}`;
            return error(message);
        }
    },
    isLowEndDevice() {
        // Simplified check; expand based on device capabilities
        return window.innerWidth < 800 || window.innerHeight < 600;
    },
};
