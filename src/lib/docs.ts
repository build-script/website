// Where the docs live on the site and where their links lead. A link to another doc stays on the site, a link to any
// other file of the repositories or to another site leaves it, in a new tab.
import { readFileSync } from "node:fs";
import { DOC_ALIASES, DOC_SOURCES_FILE, DOCS, DOCS_DIRECTORY, REPOSITORIES, type DocSources, type RepositoryKey } from "../data/docs";

/** A file of one of the repositories */
export interface RepositoryFile {
    repository: RepositoryKey;
    path: string;
}

export interface ResolvedLink {
    href: string;
    /** another site, or a file of a repository that is no doc */
    external: boolean;
}

/** The page of a doc below the base path of the site, which ends with a slash */
export function docHref(slug: string, base: string): string {
    if (!DOCS.some((doc) => doc.slug === slug)) {
        throw new Error(`src/data/docs.ts has no doc with the slug "${slug}"`);
    }
    return `${base.replace(/\/?$/, "/")}docs/${slug === "" ? "" : `${slug}/`}`;
}

/** The doc a file stands for: the file itself, the README of a directory or an alias */
function slugOf(file: RepositoryFile): string | undefined {
    const path = file.path.replace(/\/$/, "");
    const candidates = path === "" ? ["README.md"] : [path, `${path}/README.md`];

    for (const candidate of candidates) {
        const doc = DOCS.find((entry) => entry.repository === file.repository && entry.path === candidate);
        const slug = doc?.slug ?? DOC_ALIASES[`${file.repository}/${candidate}`];
        if (slug !== undefined) {
            return slug;
        }
    }

    return undefined;
}

/** The file a link to github.com shows, when it is one of the repositories on their branch */
function githubFile(url: URL): RepositoryFile | undefined {
    if (url.hostname !== "github.com") {
        return undefined;
    }

    const [owner, name, kind, branch, ...rest] = url.pathname.split("/").filter((part) => part !== "");
    const repository = (Object.keys(REPOSITORIES) as RepositoryKey[]).find((key) => REPOSITORIES[key].name === `${owner}/${name}`);

    if (repository === undefined) {
        return undefined;
    }
    if (kind === undefined) {
        return { repository, path: "" };
    }
    if ((kind === "blob" || kind === "tree") && branch === REPOSITORIES[repository].branch) {
        return { repository, path: rest.join("/") };
    }
    return undefined;
}

/** Where a link in a doc leads, relative to the file of that doc as on GitHub */
export function resolveLink(href: string, from: RepositoryFile, base: string): ResolvedLink {
    if (href.startsWith("#")) {
        return { href, external: false };
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        const url = new URL(href);
        const file = githubFile(url);
        const slug = file === undefined ? undefined : slugOf(file);
        if (slug !== undefined) {
            return { href: docHref(slug, base) + url.hash, external: false };
        }
        return { href, external: url.protocol === "https:" || url.protocol === "http:" };
    }

    const url = new URL(href, `https://repository.invalid/${from.path}`);
    const path = decodeURIComponent(url.pathname.slice(1));
    const slug = slugOf({ repository: from.repository, path });
    if (slug !== undefined) {
        return { href: docHref(slug, base) + url.hash, external: false };
    }

    const repository = REPOSITORIES[from.repository];
    return { href: `${repository.url}/blob/${repository.branch}/${path}${url.hash}`, external: true };
}

/** The repository file of a doc in .docs/, from its file URL */
export function docFile(fileURL: URL | undefined): RepositoryFile | undefined {
    const directory = DOCS_DIRECTORY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = fileURL === undefined ? null : new RegExp(`/${directory}/([^/]+)/(.+)$`).exec(fileURL.pathname);
    const repository = match?.[1];
    const path = match?.[2];

    if (repository === undefined || path === undefined || !(repository in REPOSITORIES)) {
        return undefined;
    }
    return { repository: repository as RepositoryKey, path: decodeURIComponent(path) };
}

/** The commit the docs of a repository were fetched at */
export function docCommit(repository: RepositoryKey): string {
    const sources = JSON.parse(readFileSync(DOC_SOURCES_FILE, "utf8")) as DocSources;
    return sources[repository].commit;
}
