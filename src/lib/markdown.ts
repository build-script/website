// How a doc of .docs/ becomes a page, as a plugin of Sätteri, the Markdown processor of Astro. Its first heading moves
// into the layout as the title, links lead to the pages of other docs or into a new tab, build scripts are colored
// like on the start page and tables scroll on small screens. Markdown outside .docs/ stays as it is.
import { defineHastPlugin, type HastPluginEntry } from "satteri";
import type { Element, ElementContent } from "hast";
import { docFile, resolveLink } from "./docs";
import { escapeHtml } from "./html";
import { highlightBuildScript, highlightShell } from "./highlight";

/** The docs write build scripts as kotlin, GitHub colors those best */
const HIGHLIGHTERS: Readonly<Record<string, (source: string) => string>> = {
    kotlin: highlightBuildScript,
    bash: highlightShell,
};

const isElement = (node: ElementContent, tagName: string): node is Element => node.type === "element" && node.tagName === tagName;

/** The language of a code block, from the class language-… of its code */
function languageOf(code: Element): string | undefined {
    const classes = code.properties["className"];
    const name = Array.isArray(classes) ? classes.find((value) => String(value).startsWith("language-")) : undefined;
    return name === undefined ? undefined : String(name).slice("language-".length);
}

/** @param base the base path of the site, links to other docs start with it */
export function docsMarkdown(base: string): HastPluginEntry {
    return (document) => {
        const from = docFile(document.fileURL);
        if (from === undefined) {
            return null;
        }

        let title = true;
        // the README of build-script has its sections as # and its title too: below the title they become ##
        let sectionsAsTitles = false;

        return defineHastPlugin({
            name: "docs",
            before(root) {
                sectionsAsTitles = root.children.filter((node) => node.type === "element" && node.tagName === "h1").length > 1;
            },
            element: [
                {
                    filter: ["h1", "h2", "h3", "h4", "h5"],
                    visit(node, context) {
                        if (node.tagName === "h1" && title) {
                            title = false;
                            context.removeNode(node);
                        } else if (sectionsAsTitles) {
                            context.setField(node, "tagName", `h${Number(node.tagName.slice(1)) + 1}`);
                        }
                    },
                },
                {
                    filter: ["a"],
                    visit(node, context) {
                        const href = node.properties["href"];
                        if (typeof href !== "string") {
                            return;
                        }

                        const link = resolveLink(href, from, base);
                        context.setProperty(node, "href", link.href);
                        if (link.external) {
                            context.setProperty(node, "target", "_blank");
                            context.setProperty(node, "rel", ["noopener", "noreferrer"]);
                            context.appendChild(node, {
                                type: "element",
                                tagName: "span",
                                properties: { className: ["visually-hidden"] },
                                children: [{ type: "text", value: " (opens in a new tab)" }],
                            });
                        }
                    },
                },
                {
                    filter: ["pre"],
                    visit(node, context) {
                        const code = node.children.find((child) => isElement(child, "code"));
                        if (code === undefined || code.type !== "element") {
                            return;
                        }

                        const language = languageOf(code);
                        const source = context.textContent(code).replace(/\n$/, "");
                        const highlight = (language === undefined ? undefined : HIGHLIGHTERS[language]) ?? escapeHtml;

                        return {
                            type: "element",
                            tagName: "pre",
                            // scrolls sideways when a line is too long, so it has to be reachable with the keyboard
                            properties: { className: ["code"], tabIndex: 0, dataLanguage: language ?? "text" },
                            children: [
                                {
                                    type: "element",
                                    tagName: "code",
                                    properties: {},
                                    children: [{ type: "raw", value: highlight(source) }],
                                },
                            ],
                        };
                    },
                },
                {
                    filter: ["table"],
                    visit(node, context) {
                        context.wrapNode(node, { type: "element", tagName: "div", properties: { className: ["table-scroll"] }, children: [] });
                    },
                },
            ],
        });
    };
}
