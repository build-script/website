// Code 39, the barcode of the footer, drawn at build time: every character is nine elements, bar and space by turns,
// three of them wide. Scanners read it, it takes upper case letters, digits, space and - . $ / + %

/** n is narrow, w wide, starting with a bar */
const PATTERNS: Record<string, string> = {
    "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
    "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
    A: "wnnnnwnnw", B: "nnwnnwnnw", C: "wnwnnwnnn", D: "nnnnwwnnw", E: "wnnnwwnnn",
    F: "nnwnwwnnn", G: "nnnnnwwnw", H: "wnnnnwwnn", I: "nnwnnwwnn", J: "nnnnwwwnn",
    K: "wnnnnnnww", L: "nnwnnnnww", M: "wnwnnnnwn", N: "nnnnwnnww", O: "wnnnwnnwn",
    P: "nnwnwnnwn", Q: "nnnnnnwww", R: "wnnnnnwwn", S: "nnwnnnwwn", T: "nnnnwnwwn",
    U: "wwnnnnnnw", V: "nwwnnnnnw", W: "wwwnnnnnn", X: "nwnnwnnnw", Y: "wwnnwnnnn",
    Z: "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
    "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn",
};

/** a wide element is this many narrow ones */
const WIDE = 3;

export interface Bar {
    x: number;
    width: number;
}

export interface Barcode {
    bars: Bar[];
    /** in narrow elements, the bars and the quiet zones on both sides */
    width: number;
}

/** The bars of `text` between the start and stop characters, positions in narrow elements */
export function code39(text: string, quietZone = 10): Barcode {
    const characters = `*${text.toUpperCase()}*`;
    const bars: Bar[] = [];
    let x = quietZone;

    for (const [index, character] of Array.from(characters).entries()) {
        const pattern = PATTERNS[character];

        if (pattern === undefined) {
            throw new Error(`Code 39 has no ${JSON.stringify(character)}`);
        }

        for (const [position, element] of Array.from(pattern).entries()) {
            const width = element === "w" ? WIDE : 1;

            if (position % 2 === 0) {
                bars.push({ x, width });
            }

            x += width;
        }

        // a narrow space between characters
        if (index < characters.length - 1) {
            x += 1;
        }
    }

    return { bars, width: x + quietZone };
}
