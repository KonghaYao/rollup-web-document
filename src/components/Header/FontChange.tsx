import { Component, createSignal } from "solid-js";
import { Setting } from "../../Setting";
import { SymbolParameter } from "../../Icon";

import { Select } from "./Selected";
import { loadLink } from "../../utils/loadScript";
const defaultFont =
    '-apple-system,system-ui,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,"Microsoft YaHei"';
const fontStore = [
    {
        label: "思源宋体",
        value: "Noto Serif SC",
    },
    { label: "默认黑体", value: defaultFont },
    {
        label: "江西拙楷",
        value: "'jiangxizhuokai'",
        src: "https://fastly.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/江西拙楷2.0/result.css",
    },
    {
        label: "霞鹜文楷",
        value: "'LXGW WenKai'",
        src: "https://fastly.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/LXGWWenKai-Regular/result.css",
    },
];
export const FontChange: Component<{}> = () => {
    const [fonts, setFont] = createSignal(
        fontStore.map((i) => {
            return { ...i, selected: Setting.font === i.value };
        })
    );
    const changeFont = (newFont: string) => {
        Setting.font = newFont;
        setFont((languages) => {
            return languages.map((i) => {
                if (Setting.font === i.value) {
                    if (i.src) loadLink(i.src);
                    return { ...i, selected: true };
                }
                return {
                    ...i,
                    selected: false,
                };
            });
        });
    };
    changeFont(Setting.font);
    return (
        <Select
            data={fonts()}
            onclick={(item) => {
                changeFont(item.value);
            }}
        >
            <div slot="trigger" className="w-full px-4  ">
                <SymbolParameter></SymbolParameter>
            </div>
        </Select>
    );
};
