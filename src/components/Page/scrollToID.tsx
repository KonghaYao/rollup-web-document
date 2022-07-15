import { router } from "../../router/index";
import { createSingleHighlight } from "./createSingleHighlight";
export const [highlightEL, highlightHub] = createSingleHighlight();
export function scrollToID(position: string, smooth = true) {
    const selector = `[data-info="${position}"]`;
    const el = document.querySelector(selector);
    if (el) {
        el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
        highlightEL(el as HTMLElement, position);
        setScrollID(position);
    }
}
/* 直接写入，不添加 id */
export const setScrollID = (id: string) => {
    const fake = new URL(
        router.getCurrentLocation().hashString,
        location.origin
    );
    fake.searchParams.set("position", id);
    const hash = fake.toString().replace(location.origin, "");
    router.navigate(hash, {
        callHooks: false,
    });
};
