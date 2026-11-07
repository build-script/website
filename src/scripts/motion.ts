// What every animation of the page asks first

export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

/** Calls `start` once, when the element is in view for the first time */
export function whenVisible(element: Element, start: () => void, threshold = 0.35): void {
    if (!("IntersectionObserver" in window)) {
        start();
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                observer.disconnect();
                start();
            }
        },
        { threshold },
    );

    observer.observe(element);
}
