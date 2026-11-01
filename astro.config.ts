import { defineConfig, fontProviders } from "astro/config";

// A static page: HTML rendered at build time, every style inlined into it, the fonts self-hosted and preloaded,
// a few small scripts for the terminal, the languages and the reveals. No framework at runtime.
export default defineConfig({
    // TODO: the domain of the page, for canonical links and Open Graph
    // site: "https://build-script.dev",
    compressHTML: true,
    devToolbar: { enabled: false },
    build: {
        // the page is small, one request renders it
        inlineStylesheets: "always",
    },
    fonts: [
        {
            provider: fontProviders.local(),
            name: "Archivo Display",
            cssVariable: "--font-display",
            fallbacks: ["Arial Black", "sans-serif"],
            options: {
                variants: [{ src: ["./src/assets/fonts/archivo-display.woff2"], weight: "800 900", style: "normal" }],
            },
        },
        {
            provider: fontProviders.local(),
            name: "JetBrains Mono",
            cssVariable: "--font-mono",
            fallbacks: ["ui-monospace", "monospace"],
            options: {
                variants: [{ src: ["./src/assets/fonts/jetbrains-mono.woff2"], weight: "400 700", style: "normal" }],
            },
        },
    ],
});
