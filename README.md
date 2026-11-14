# build-script website

The landing page of [build-script](https://github.com/build-script/build): one static page, built with
[Astro](https://astro.build) and TypeScript.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type checks, then writes dist/
npm run preview    # serves dist/
```

## Why it is fast

The page follows what the fastest sites have in common: HTML rendered ahead of time, critical CSS in the page, little
or no JavaScript, fonts self-hosted and preloaded, no images.

- **Static HTML.** Astro renders the page at build time and ships no framework. The code examples are highlighted at
  build time too, the barcode and the diagram are inline SVG computed at build time.
- **One request renders the page.** All CSS is inlined (`build.inlineStylesheets: "always"`), about 13 KB gzipped
  with the markup.
- **Small fonts.** `npm run fonts` cuts Archivo and JetBrains Mono down to the glyphs and the part of the variation
  space the page uses: 13 KB and 23 KB instead of 88 KB and 39 KB. Astro's font API preloads them and generates fallback
  metrics, so the text does not jump when they arrive.
- **2 KB of JavaScript**, deferred modules for the things that move: the terminal, the languages, the reveals and the
  copy button. Without JavaScript, or with reduced motion, the page shows its end state.

## Layout

| Path                    | What it holds                                                                   |
|-------------------------|---------------------------------------------------------------------------------|
| `src/styles/tokens.css` | The design system: colors, type, spacing, grid. Nothing else defines a color.   |
| `src/data/`             | What the page says: version, links, the real output of build-script, languages  |
| `src/components/`       | The sections of the page                                                        |
| `src/scripts/`          | The TypeScript that runs in the browser                                         |
| `src/lib/`              | Build-time helpers: highlighting, the Code 39 barcode, escaping                 |
| `scripts/`              | `subset-fonts.ts`, which writes `src/assets/fonts/`                             |

## Keeping it true

Every command, script and log line on the page is real. The outputs in `src/data/terminal.ts` and
`src/data/quickstart.ts` were taken from build-script at the commit in `src/data/site.ts`; update both together.
Open questions are marked `TODO` in the code, like the domain and the first release.

## License

The code is MIT licensed, see [LICENSE](LICENSE). Archivo and JetBrains Mono are under the SIL Open Font License, see
`src/assets/fonts/`.
