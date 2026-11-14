// Colors build scripts at build time, so the page ships no highlighter: keywords in orange, comments and punctuation
// muted, everything else in the color of the text. Only what the build language has, see docs/language.md.
import { escapeHtml } from "./html";

const KEYWORDS = new Set(["use", "fn", "if", "else", "true", "false"]);
const TYPES = new Set(["str", "int", "bool", "module", "any", "unit", "list"]);

interface Rule {
    pattern: RegExp;
    kind: (match: string, rest: string) => string | undefined;
}

const RULES: Rule[] = [
    { pattern: /^\/\/[^\n]*/, kind: () => "comment" },
    { pattern: /^\/\*[\s\S]*?\*\//, kind: () => "comment" },
    { pattern: /^"(?:\\.|[^"\\])*"/, kind: () => "string" },
    { pattern: /^\d+/, kind: () => "number" },
    {
        pattern: /^[A-Za-z_][A-Za-z0-9_]*/,
        kind: (word, rest) => {
            if (KEYWORDS.has(word)) {
                return "keyword";
            }

            // list(...) is a call, list<str> a type
            if (/^\s*\(/.test(rest)) {
                return "call";
            }

            if (TYPES.has(word)) {
                return "type";
            }

            return undefined;
        },
    },
    { pattern: /^(?:->|==|!=|&&|\|\||[{}()[\],=<>|:+])/, kind: () => "punctuation" },
];

/** The script as markup with a span per colored token */
export function highlightBuildScript(source: string): string {
    let markup = "";
    let rest = source;

    while (rest.length > 0) {
        const rule = RULES.find((candidate) => candidate.pattern.test(rest));
        const match = rule === undefined ? undefined : rest.match(rule.pattern)?.[0];

        if (rule === undefined || match === undefined) {
            markup += escapeHtml(rest[0] ?? "");
            rest = rest.slice(1);
            continue;
        }

        rest = rest.slice(match.length);
        const kind = rule.kind(match, rest);
        markup += kind === undefined ? escapeHtml(match) : `<span class="token-${kind}">${escapeHtml(match)}</span>`;
    }

    return markup;
}

/** Shell commands as markup: only the comments are muted, like the ones after a command in the docs */
export function highlightShell(source: string): string {
    return source
        .split("\n")
        .map((line) => {
            const comment = /(^|\s)#.*$/.exec(line);
            if (comment === null) {
                return escapeHtml(line);
            }
            const start = comment.index + (comment[1] ?? "").length;
            return `${escapeHtml(line.slice(0, start))}<span class="token-comment">${escapeHtml(line.slice(start))}</span>`;
        })
        .join("\n");
}

/** How many lines a source has, without the last line break */
export function countLines(source: string): number {
    return source.trimEnd().split("\n").length;
}
