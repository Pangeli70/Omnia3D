import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { LinkButton } from "../islands/LinkButton.tsx";
import { ViewerIsland } from "../islands/Viewer.tsx";

export default function Home() {
    const count = useSignal(3);

    return (
        <div>
            <ViewerIsland />
            <div
                class="px-4 py-8 mx-auto bg-[#86efac]"
                style={{
                    zIndex: 2,
                    position: "relative",
                    backgroundColor: "rgba(140, 232, 155, 0.5)",
                }}
            >
                <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
                    <img
                        class="my-6"
                        src="/logo.svg"
                        width="128"
                        height="128"
                        alt="the Fresh logo: a sliced lemon dripping with juice"
                    />
                    <h1 class="text-4xl font-bold">Welcome to Ultra-V</h1>
                    <p class="my-4">
                        3D viewer powered by Three.js and Fresh on Deno Deploy.
                    </p>
                    <Counter count={count} />
                    <p>
                        <LinkButton caption="Contact" href="/contact" />
                        <LinkButton caption="Login" href="/login" />
                        <LinkButton caption="About" href="/about" />
                    </p>
                </div>
            </div>
        </div>
    );
}
