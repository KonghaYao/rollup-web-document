import Solid from "solid-js";
declare module "solid-js" {
    export namespace JSX {
        // 下列是自定义的 Web Component
        export interface IntrinsicElements {
            "model-viewer": any;
            "sl-textarea": any;
            "sl-tag": any;
            "sl-split-panel": any;
            "sl-color-picker": any;
            "sl-dropdown": any;

            "sl-button": any;
            "sl-range": any;
            "sl-input": any;
            "xy-select": any;
            "xy-option": any;
            "xy-tips": any;
            "intersecting-circles-spinner": any;
            "xy-input": any;
            "atom-spinner": any;
            "sl-image-comparer": any;
            "sl-format-bytes": any;
        }
    }
}
