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
} from "https://fastly.jsdelivr.net/npm/rollup-web@4.4.0/dist/index.js";
import ts from "https://esm.sh/@babel/preset-typescript";
import SolidPresets from "https://esm.sh/babel-preset-solid@1.3.13";
import { mdx } from "https://fastly.jsdelivr.net/npm/rollup-web@4.4.0/dist/plugins/mdx.js";
// 导入各种插件
const [{ default: json }, { babelCore }, { postcss }] =
    await PluginLoader.loads("plugin-json", "babel.core", "postcss");

console.log("加载插件完成");
const isDev = ["localhost", "127.0.0.1"].includes(globalThis.location.hostname);
const CDN = globalThis.location.origin + "/";
const RollupConfig = {
    plugins: [
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
                            el.classList = props.class;
                            el.onclick = props.onclick
                            return el}`,
                    };
                }
            },
        },
        {
            name: "auto-import-mdx",
            transform(code, id) {
                if (id.endsWith(".mdx")) {
                    const result =
                        'import {Embed} from "/src/Support/Embed.tsx";\r\n\r\n' +
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
    // useDataCache: {
    //     ignore: isDev
    //         ? ["src/pages/*.tsx", "script/PageList.json"].map((i) => CDN + i)
    //         : [],
    //     maxAge: 24 * 60 * 60,
    // },
    extraBundle: [],
});
compiler.useWorker();
