// ! 在 worker 中不能够使用 import map
// import {
//     Compiler,
//     sky_module,
//     PluginLoader,
// } from "../rollup-web/dist/index.js";
// import { drawDependence } from "../rollup-web/dist/plugins/drawDependence.js";
import {
    Compiler,
    sky_module,
    PluginLoader,
} from "https://fastly.jsdelivr.net/npm/rollup-web@4.3.3/dist/index.js";
import ts from "https://esm.sh/@babel/preset-typescript";
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";

// mdx 在 worker 中构造失败，所以使用这种方式进行一个保全
import { decodeNamedCharacterReference } from "https://fastly.jsdelivr.net/npm/decode-named-character-reference@1.0.2/index.js/+esm";
(async () => {
    let info = "";
    const mdxFakeElement = new Proxy(
        {},
        {
            get() {
                return info;
            },
            set(_, __, data) {
                info = decodeNamedCharacterReference(data);
                return true;
            },
        }
    );
    globalThis.document = {
        createElement() {
            return mdxFakeElement;
        },
    };
})();

// 导入各种插件
const [{ default: json }, { babelCore }, { postcss }, { mdx }] =
    await PluginLoader.loads("plugin-json", "babel.core", "postcss", "mdx");

console.log("加载插件完成");
const isDev = ["localhost", "127.0.0.1"].includes(globalThis.location.hostname);
const CDN = globalThis.location.origin + "/";
const RollupConfig = {
    plugins: [
        mdx({
            options: {
                jsxImportSource: "solid-jsx",
            },
        }),

        json(),
        babelCore({
            babelrc: {
                presets: [ts, SolidPresets],
            },
            extensions: [".tsx", ".mdx", ".ts"],
            log(id) {
                // console.log("%cbabel ==> " + id, "color:blue");
            },
        }),
        sky_module({
            cdn: "https://cdn.skypack.dev/",
            rename: {
                "solid-js": "solid-js@1.4.2",
                "solid-js/web": "solid-js@1.4.2/web",
                "solid-js/store": "solid-js@1.4.2/store",
            },
        }),
        postcss(),
    ],
};

const compiler = new Compiler(RollupConfig, {
    // 用于为相对地址添加绝对地址
    root: CDN,
    autoBuildFetchHook: false,
    // 为没有后缀名的 url 添加后缀名
    extensions: [".tsx", ".ts", ".js", ".json", ".css"],
    log(url) {
        console.log("%c Download ==> " + url, "color:green");
    },
    // useDataCache: {
    //     ignore: isDev
    //         ? ["src/pages/*.tsx", "script/PageList.json"].map((i) => CDN + i)
    //         : [],
    //     maxAge: 24 * 60 * 60,
    // },
    extraBundle: [],
});
compiler.useWorker();
