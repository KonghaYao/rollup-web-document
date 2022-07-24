import { Component, createSignal } from "solid-js";
import { Setting } from "../../Setting";
import { SymbolParameter } from "../../Icon";
import { JSX } from "solid-js";
import { Select } from "./Selected";
const defaultFont =
    '-apple-system,system-ui,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial!important;';

export const FontChange: Component<{}> = () => {
    const [fonts, setFont] = createSignal(
        [
            { label: "思源宋体", value: "Noto Serif SC" },
            { label: "默认黑体", value: defaultFont },
        ].map((i) => {
            return { ...i, selected: Setting.font === i.value };
        })
    );
    const changeFont = (newFont: string) => {
        Setting.font = newFont;
        setFont((languages) => {
            return languages.map((i) => {
                return {
                    ...i,
                    selected: Setting.font === i.value,
                };
            });
        });
    };
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
