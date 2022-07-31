import { loadLink, loadScript } from "./loadScript";
import { NPM } from "../global";
import { useGlobal } from "./useGlobal";
import { isDark } from "./isDark";

/* 对这个元素下面的代码元素进行高亮 */
export const PrismSupport = async (el: HTMLElement) => {
    let Prism = useGlobal<any>("Prism");
    if (!Prism) {
        await loadScript(NPM + "prismjs/prism.min.js");
        await loadScript(
            NPM + "prismjs/plugins/autoloader/prism-autoloader.min.js"
        );

        if (isDark()) {
            await loadLink(
                NPM + "prism-themes@1.9.0/themes/prism-atom-dark.min.css"
            );
        } else {
            await loadLink(
                NPM + "prism-themes@1.9.0/themes/prism-one-light.min.css"
            );
        }
        Prism = useGlobal<any>("Prism");
        Prism.plugins.autoloader.languages_path = NPM + "prismjs/components/";
        Prism.manual = true;
    }
    el.querySelectorAll("pre code").forEach((i) => {
        Prism.highlightElement(i);
    });
};
