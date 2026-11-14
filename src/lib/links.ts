// A page of another site opens in a new tab: the visitor keeps this one

export interface LinkAttributes {
    target?: "_blank";
    rel?: string;
}

/** The attributes of a link to this href, spread into the a */
export function linkAttributes(href: string): LinkAttributes {
    return /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
