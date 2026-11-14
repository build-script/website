/// <reference types="node" />
// Writes the two fonts of the page into src/assets/fonts/: only the glyphs it shows and only the part of the
// variation space it uses. Archivo at its widest, wdth 125, in weights 800 to 900 for the headlines, JetBrains Mono
// in 400 to 700 for everything else. Then measures the headline font into src/data/display-metrics.ts, so every
// headline can be sized to fit its container. Run it again after the page needs new characters: npm run fonts
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Blob, Buffer as GlyphBuffer, Face, Font, shape } from "harfbuzzjs";
import subsetFont from "subset-font";

interface FontSubset {
    /** the variable font of the fontsource package, below node_modules */
    source: string;
    target: string;
    text: string;
    axes: Record<string, number | { min: number; max: number }>;
}

/** Every printable character of ASCII, the page is in English */
const ASCII = Array.from({ length: 0x7f - 0x20 }, (_, index) => String.fromCharCode(0x20 + index)).join("");

/** Marks of the design: crosses, arrows of the buttons, dashes, the prompt of the terminal */
const MARKS = "×↗↘→—–’…·";

const ARCHIVO = "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2";

const SUBSETS: FontSubset[] = [
    {
        source: ARCHIVO,
        target: "archivo-display.woff2",
        text: ASCII + MARKS,
        axes: { wdth: 125, wght: { min: 800, max: 900 } },
    },
    {
        source: "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
        target: "jetbrains-mono.woff2",
        text: ASCII + MARKS,
        axes: { wght: { min: 400, max: 700 } },
    },
];

/** What the headlines may show: they are uppercase, see .display in global.css */
const DISPLAY = ASCII.replace(/[a-z]/g, "") + "’…";

/** The instance the headlines show: .display is weight 900 */
const DISPLAY_AXES = { wdth: 125, wght: 900 };

const nodeModules = fileURLToPath(new URL("../node_modules/", import.meta.url));
const fontsDirectory = fileURLToPath(new URL("../src/assets/fonts/", import.meta.url));
const metricsFile = fileURLToPath(new URL("../src/data/display-metrics.ts", import.meta.url));

await mkdir(fontsDirectory, { recursive: true });

for (const subset of SUBSETS) {
    const original = await readFile(nodeModules + subset.source);
    const smaller = await subsetFont(original, subset.text, {
        targetFormat: "woff2",
        variationAxes: subset.axes,
    });

    await writeFile(fontsDirectory + subset.target, smaller);
    console.log(`${subset.target}: ${Math.round(original.length / 1024)} KB to ${Math.round(smaller.length / 1024)} KB`);
}

// a static instance as TrueType, HarfBuzz reads no woff2
const instance = await subsetFont(await readFile(nodeModules + ARCHIVO), DISPLAY, {
    targetFormat: "sfnt",
    variationAxes: DISPLAY_AXES,
});
const face = new Face(new Blob(instance));
const font = new Font(face);

/** the width of a text in em, shaped like the browser shapes it: with the kerning of the font */
function width(text: string): number {
    const buffer = new GlyphBuffer();
    buffer.addText(text);
    buffer.guessSegmentProperties();
    shape(font, buffer);
    return buffer.getGlyphPositions().reduce((sum, position) => sum + position.xAdvance, 0) / face.upem;
}

const round = (value: number): number => Math.round(value * 10_000) / 10_000;

const characters = [...DISPLAY];
const advances = characters.map((character) => [character, round(width(character))] as const);
const kerning = characters
    .flatMap((first) => characters.map((second) => first + second))
    .map((pair) => [pair, round(width(pair) - width(pair[0]!) - width(pair[1]!))] as const)
    .filter(([, value]) => value !== 0);

const entries = (pairs: readonly (readonly [string, number])[]): string =>
    pairs.map(([key, value]) => `    ${JSON.stringify(key)}: ${value},`).join("\n");

await writeFile(
    metricsFile,
    `// Written by scripts/subset-fonts.ts, npm run fonts: the widths of the headline font, Archivo at wdth ${DISPLAY_AXES.wdth} and
// wght ${DISPLAY_AXES.wght}, in em. src/lib/fit.ts measures the headlines with them.

/** the advance of every character a headline may show */
export const ADVANCES: Readonly<Record<string, number>> = {
${entries(advances)}
};

/** what the font adds between two characters, only the pairs where it is not 0 */
export const KERNING: Readonly<Record<string, number>> = {
${entries(kerning)}
};
`,
);
console.log(`display-metrics.ts: ${advances.length} characters, ${kerning.length} kerning pairs`);
