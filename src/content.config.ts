// The docs as a content collection: the files of src/data/docs.ts in .docs/, fetched by npm run docs
import { existsSync } from "node:fs";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { DOC_SOURCES_FILE, DOCS, DOCS_DIRECTORY } from "./data/docs";

if (!existsSync(DOC_SOURCES_FILE)) {
    throw new Error(`${DOCS_DIRECTORY}/ has no docs: npm run docs fetches them from the repositories of build-script`);
}

const docs = defineCollection({
    loader: glob({
        base: DOCS_DIRECTORY,
        pattern: DOCS.map((doc) => `${doc.repository}/${doc.path}`),
        // the path in .docs/, the key of src/data/docs.ts
        generateId: ({ entry }) => entry,
    }),
});

export const collections = { docs };
