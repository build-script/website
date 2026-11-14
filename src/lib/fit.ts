// Headlines are as large as their size token allows and never wider than their container: the build measures them
// with the widths of their font, the browser divides the width of the container by that, see .fit in global.css.
import { ADVANCES, KERNING } from "../data/display-metrics";
import tokens from "../styles/tokens.css?raw";

/** the tracking of the headlines in em, from the one place of the design tokens */
const TRACKING = Number(/--tracking-display:\s*(-?[\d.]+)em;/.exec(tokens)?.[1]);

if (Number.isNaN(TRACKING)) {
    throw new Error("tokens.css has no --tracking-display in em");
}

/** the width of a text in em as a headline shows it: uppercase, kerned, every letter followed by the tracking */
function displayWidth(text: string): number {
    const characters = [...text.toUpperCase()];
    return characters.reduce((sum, character, index) => {
        const advance = ADVANCES[character];
        if (advance === undefined) {
            throw new Error(`the headline font has no width of "${character}": add it to DISPLAY in scripts/subset-fonts.ts`);
        }
        const kerning = index > 0 ? (KERNING[characters[index - 1] + character] ?? 0) : 0;
        return sum + advance + kerning + TRACKING;
    }, 0);
}

/** rounded up, a headline may end a hair short of its container but never past it */
const ceil = (value: number): number => Math.ceil(value * 1000) / 1000;

/**
 * The style of a headline of these lines: --fit-line, the width of its widest line, and --fit-word, the width of its
 * widest word for a headline that may break between words
 */
export function fitStyle(lines: readonly string[]): string {
    const line = Math.max(...lines.map(displayWidth));
    const word = Math.max(...lines.flatMap((text) => text.split(" ")).map(displayWidth));
    return `--fit-line: ${ceil(line)}; --fit-word: ${ceil(word)}`;
}
