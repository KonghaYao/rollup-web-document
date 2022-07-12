import { createSingleHighlight } from "./createSingleHighlight";

export const highlightEL = createSingleHighlight();
export function scrollToID(position: string) {
    const selector = `[data-info="${position}"]`;
    const el = document.querySelector(selector);
    el?.scrollIntoView({ behavior: "smooth" });

    el && highlightEL(el as HTMLElement);
}
