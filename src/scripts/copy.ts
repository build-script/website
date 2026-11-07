// Buttons that copy a command: data-copy holds what goes to the clipboard

const CONFIRMATION_TIME = 1800;

export function enableCopyButtons(): void {
    if (!navigator.clipboard) {
        return;
    }

    for (const button of document.querySelectorAll<HTMLButtonElement>("button[data-copy]")) {
        const label = button.querySelector<HTMLElement>("[data-copy-label]");
        const idle = label?.textContent ?? "";

        button.hidden = false;
        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(button.dataset["copy"] ?? "");
            } catch {
                return;
            }

            if (label !== null) {
                label.textContent = "Copied";
                window.setTimeout(() => (label.textContent = idle), CONFIRMATION_TIME);
            }
        });
    }
}
