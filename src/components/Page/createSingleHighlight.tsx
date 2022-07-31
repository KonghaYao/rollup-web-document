import mitt from "mitt";
import { annotate } from "rough-notation";
import { RoughAnnotation } from "rough-notation/lib/model";
import { isDark } from "../../utils/isDark";
import { highlightHub } from "./scrollToID";

export const createSingleHighlight = () => {
    const hub = mitt<{
        highlight: string;
    }>();
    let highlighting: RoughAnnotation;
    let lastID = "";
    const prefersDarkMode = isDark();
    return [
        (el: HTMLElement, id?: string) => {
            if ((id && id !== lastID) || id === undefined) {
                /* 性能开销不大，所以直接删除 */
                highlighting && highlighting.remove();
                highlighting = annotate(el, {
                    type: "highlight",
                    color: prefersDarkMode ? "#044115" : "#fef3c7",
                });
                highlighting.show();
                id && (lastID = id);
                highlightHub.emit("highlight", id!);
            }
        },
        hub,
    ] as const;
};
