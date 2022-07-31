// ! 在 worker 中不能够使用 import map
// import {
//     Compiler,
//     sky_module,
//     PluginLoader,
// } from "../rollup-web/dist/index.js";
import {
    Compiler,
    sky_module,
    PluginLoader,
} from "https://cdn.jsdelivr.net/npm/rollup-web@4.5.3/dist/index.js";

import ts from "https://esm.sh/@babel/preset-typescript";
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
import { mdx } from "https://cdn.jsdelivr.net/npm/rollup-web@4.5.1/dist/plugins/mdx.js";
const { postcss } = await import(
    "https://cdn.jsdelivr.net/npm/rollup-web@4.5.3/dist/plugins/postcss.js"
);
// 导入各种插件
const [{ default: json }, { babelCore }] = await PluginLoader.loads(
    "plugin-json",
    "babel.core"
);

console.log("加载插件完成");
const isDev = ["localhost", "127.0.0.1"].includes(globalThis.location.hostname);
console.log(isDev);

const Root = new URL("../", location.href).toString();

console.log("Root ", Root);
const RollupConfig = {
    plugins: [
        // 自定义实现一个 SVG Plugin
        {
            name: "svg",
            resolveId(thisFile) {
                if (thisFile.endsWith(".svg")) {
                    return "https://cdn.jsdelivr.net/npm/" + thisFile;
                }

                return;
            },
            async load(id) {
                if (id.endsWith(".svg")) {
                    const code = await fetch(id).then((res) => res.text());
                    return {
                        code: `export default (props)=>{
                            const el =(new DOMParser().parseFromString(${JSON.stringify(
                                code
                            )}, 'image/svg+xml')).firstChild;
                            el.classList = 'svg_bundle '+(props.class||"");
                            el.onclick = props.onclick
                            return el}`,
                    };
                }
            },
        },
        // 使用 添加 import 头的方式可以实现对象注入
        {
            name: "auto-import-mdx",
            transform(code, id) {
                if (id.endsWith(".mdx")) {
                    const hasCode =
                        code.startsWith("import") || code.startsWith("export");
                    // 正文与源代码需要有换行进行分割
                    const result =
                        `import {Embed} from '${new URL(
                            "./src/Support/Embed.tsx",
                            Root
                        ).toString()}';
                        ` +
                        (hasCode ? "" : "\n") +
                        code;
                    return result;
                }
            },
        },
        mdx({
            options: {
                jsxImportSource: "solid-jsx",
            },
            // log(code, id) {
            //     console.log(id);
            // },
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
        postcss({}),
        sky_module({
            cdn: "https://cdn.skypack.dev/",
            rename: {
                "solid-js": "solid-js@1.4.2",
                "solid-js/web": "solid-js@1.4.2/web",
                "solid-js/store": "solid-js@1.4.2/store",
            },
        }),
    ],
};

const compiler = new Compiler(RollupConfig, {
    // 用于为相对地址添加绝对地址
    root: Root,
    // 为没有后缀名的 url 添加后缀名
    extensions: [".tsx", ".ts", ".mdx", ".js", ".json", ".css"],
    // useDataCache: {
    //     ignore: isDev
    //         ? ["src/pages/*.tsx", "script/PageList.json"].map((i) => CDN + i)
    //         : [],
    //     maxAge: 24 * 60 * 60,
    // },
    extraBundle: [],
});
compiler.useWorker();
