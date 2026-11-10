// Sections with data-reveal wipe in once they scroll into view. The class has-js hides them before the first paint,
// so everything that may stay hidden is revealed at once when there is no motion or no observer.
import { prefersReducedMotion } from "./motion";

export function revealSections(): void {
    const sections = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
        sections.forEach((section) => section.classList.add("is-revealed"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    observer.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
}
