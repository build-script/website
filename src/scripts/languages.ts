// One language of the grid is in color, the others gray: the active one moves on by itself, and pointing at or
// focusing another one makes it the active one. Without motion it only follows the pointer and the focus.
import { prefersReducedMotion, whenVisible } from "./motion";

const ROTATION_INTERVAL = 2200;

export function rotateLanguages(): void {
    for (const grid of document.querySelectorAll<HTMLElement>("[data-languages]")) {
        const tiles = Array.from(grid.querySelectorAll<HTMLElement>("[data-language]"));
        let active = Math.max(0, tiles.findIndex((tile) => tile.classList.contains("is-active")));
        let timer: number | undefined;

        const activate = (index: number): void => {
            tiles[active]?.classList.remove("is-active");
            active = index;
            tiles[active]?.classList.add("is-active");
        };

        const start = (): void => {
            if (prefersReducedMotion() || timer !== undefined) {
                return;
            }

            timer = window.setInterval(() => activate((active + 1) % tiles.length), ROTATION_INTERVAL);
        };

        const stop = (): void => {
            window.clearInterval(timer);
            timer = undefined;
        };

        for (const [index, tile] of tiles.entries()) {
            tile.addEventListener("pointerenter", () => activate(index));
            tile.addEventListener("focusin", () => activate(index));
        }

        grid.addEventListener("pointerenter", stop);
        grid.addEventListener("pointerleave", start);
        grid.addEventListener("focusin", stop);
        grid.addEventListener("focusout", start);
        whenVisible(grid, start, 0.2);
    }
}
