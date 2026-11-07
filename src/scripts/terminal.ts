// Replays a terminal of the page: the command is typed, then the log lines of build-script come one after the
// other. The page holds the end state, so without JavaScript or with reduced motion nothing has to happen.
import { prefersReducedMotion, wait, whenVisible } from "./motion";

/** milliseconds per typed character */
const TYPING_DELAY = 85;

/** before the next command is typed */
const STEP_DELAY = 1600;

export function replayTerminals(): void {
    if (prefersReducedMotion()) {
        return;
    }

    for (const terminal of document.querySelectorAll<HTMLElement>("[data-terminal]")) {
        const steps = Array.from(terminal.querySelectorAll<HTMLElement>("[data-step]"));
        const cursor = terminal.querySelector<HTMLElement>(".terminal-cursor");

        if (steps.length === 0 || cursor === null) {
            continue;
        }

        hide(steps);
        whenVisible(terminal, () => void replay(steps, cursor));
    }
}

function hide(steps: HTMLElement[]): void {
    for (const step of steps) {
        step.classList.add("is-pending");

        for (const line of step.querySelectorAll(".terminal-line")) {
            line.classList.add("is-pending");
        }

        const command = step.querySelector<HTMLElement>("[data-command]");

        if (command !== null) {
            command.textContent = "";
        }
    }
}

async function replay(steps: HTMLElement[], cursor: HTMLElement): Promise<void> {
    for (const [index, step] of steps.entries()) {
        if (index > 0) {
            await wait(STEP_DELAY);
        }

        step.classList.remove("is-pending");
        const command = step.querySelector<HTMLElement>("[data-command]");

        if (command !== null) {
            command.after(cursor);
            await type(command, command.dataset["command"] ?? "");
        }

        for (const line of step.querySelectorAll<HTMLElement>(".terminal-line")) {
            await wait(Number(line.dataset["pause"] ?? 0));
            line.classList.remove("is-pending");
            line.after(cursor);
        }
    }

    // the prompt waits for the next command, like after a real build
    steps.at(-1)?.after(cursor);
}

async function type(element: HTMLElement, text: string): Promise<void> {
    for (const character of text) {
        await wait(TYPING_DELAY);
        element.textContent += character;
    }

    await wait(TYPING_DELAY * 3);
}
