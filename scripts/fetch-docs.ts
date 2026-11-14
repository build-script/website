/// <reference types="node" />
// Fetches the docs of build-script and of its official plugins into .docs/, from the newest commit of each repository:
// only the files src/data/docs.ts lists, with git. The docs pages are built from them, so this runs before every build
// in the workflows, and by hand after the docs changed: npm run docs
import { execFileSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { DOC_ALIASES, DOC_SOURCES_FILE, DOCS, DOCS_DIRECTORY, REPOSITORIES, type DocSources, type RepositoryKey } from "../src/data/docs.ts";

function git(...args: string[]): string {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();
}

await rm(DOCS_DIRECTORY, { recursive: true, force: true });
await mkdir(DOCS_DIRECTORY, { recursive: true });

const sources = {} as DocSources;

for (const key of Object.keys(REPOSITORIES) as RepositoryKey[]) {
    const repository = REPOSITORIES[key];
    const directory = `${DOCS_DIRECTORY}/${key}`;
    const files = [
        ...DOCS.filter((doc) => doc.repository === key).map((doc) => doc.path),
        ...Object.keys(DOC_ALIASES).filter((alias) => alias.startsWith(`${key}/`)).map((alias) => alias.slice(key.length + 1)),
    ];

    // no history and no blobs but those of the listed files
    git("clone", "--quiet", "--depth", "1", "--filter=blob:none", "--no-checkout", "--branch", repository.branch, `${repository.url}.git`, directory);
    git("-C", directory, "sparse-checkout", "set", "--no-cone", ...files.map((file) => `/${file}`));
    git("-C", directory, "checkout", "--quiet");

    sources[key] = { commit: git("-C", directory, "rev-parse", "HEAD") };
    console.log(`${repository.name} ${sources[key].commit.slice(0, 7)}: ${files.join(", ")}`);
}

await writeFile(DOC_SOURCES_FILE, `${JSON.stringify(sources, null, 4)}\n`);
