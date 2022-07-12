import { annotate } from "rough-notation";
import { RoughAnnotation } from "rough-notation/lib/model";

export const createSingleHighlight = () => {
    let highlighting: RoughAnnotation;
    return (el: HTMLElement) => {
        /* 性能开销不大，所以直接删除 */
        highlighting && highlighting.remove();
        highlighting = annotate(el, {
            type: "highlight",
            color: "#fef3c7",
        });
        highlighting.show();
    };
};
