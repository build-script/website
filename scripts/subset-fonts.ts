/// <reference types="node" />
// Writes the two fonts of the page into src/assets/fonts/: only the glyphs it shows and only the part of the
// variation space it uses. Archivo at its widest, wdth 125, in weights 800 to 900 for the headlines, JetBrains Mono
// in 400 to 700 for everything else. Run it again after the page needs new characters: npm run fonts
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
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

const SUBSETS: FontSubset[] = [
    {
        source: "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
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

const nodeModules = fileURLToPath(new URL("../node_modules/", import.meta.url));
const fontsDirectory = fileURLToPath(new URL("../src/assets/fonts/", import.meta.url));

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
