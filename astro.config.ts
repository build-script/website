import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig, fontProviders } from "astro/config";
import { docsMarkdown } from "./src/lib/markdown";

// The address of the page comes from the deploy: on GitHub Pages the origin and the base path of the Pages settings,
// https://build-script.github.io and /website, or the own domain once one is set there. Without them, as in the
// check and on the dev server, the page lives at the root and has no canonical link.
// TODO: an own domain in the Pages settings
const site = process.env["SITE_ORIGIN"];
const base = process.env["BASE_PATH"];

// Static pages: HTML rendered at build time, every style inlined into it, the fonts self-hosted and preloaded, a few
// small scripts for the terminal, the languages and the reveals. No framework at runtime. The docs come from the
// repositories of build-script as Markdown, see src/data/docs.ts.
export default defineConfig({
    ...(site ? { site } : {}),
    ...(base ? { base } : {}),
    compressHTML: true,
    devToolbar: { enabled: false },
    build: {
        // the pages are small, one request renders each
        inlineStylesheets: "always",
    },
    // a page of the site loads while the pointer rests on its link, or as soon as a finger touches it
    prefetch: { prefetchAll: true, defaultStrategy: "hover" },
    markdown: {
        // code is colored by src/lib/markdown.ts, without a highlighter in the build
        syntaxHighlight: false,
        processor: satteri({
            hastPlugins: [docsMarkdown(base ?? "/")],
            // straight quotes, the monospace font of the page has no curly ones
            features: { smartPunctuation: false },
        }),
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
