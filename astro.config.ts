import { defineConfig } from "astro/config";

// A static page: HTML rendered at build time, every style inlined into it. No framework at runtime.
export default defineConfig({
    // TODO: the domain of the page, for canonical links and Open Graph
    // site: "https://build-script.dev",
    compressHTML: true,
    devToolbar: { enabled: false },
    build: {
        // the page is small, one request renders it
        inlineStylesheets: "always",
    },
});
