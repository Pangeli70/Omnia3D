import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
    return (
        <html>
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Ultra-V</title>

                {/* <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
                /> */}
                <link rel="stylesheet" href="https://classless.de/classless.css"></link>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <Component />
            </body>
        </html>
    );
}
