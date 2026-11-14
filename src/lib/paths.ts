// The page may live below a base path, /website/ on GitHub Pages: links to the page and its own files go through here.

/** the address of the page itself, always with a trailing slash */
export const HOME = import.meta.env.BASE_URL.replace(/\/?$/, "/");

/** a file of public/, like favicon.svg */
export function publicFile(name: string): string {
    return HOME + name;
}
