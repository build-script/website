// Text that goes into markup built in the frontmatter of a component

const ENTITIES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export function escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, (character) => ENTITIES[character] ?? character);
}
