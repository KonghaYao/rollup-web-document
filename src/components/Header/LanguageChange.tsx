import { Component, createSignal, For } from "solid-js";
import { Setting } from "../../Setting";
import { LanguageOutline } from "../../Icon";
import { Select } from "./Selected";
import { isDark } from "../../utils/isDark";
export const LanguageChange: Component<{}> = () => {
    const [languages, setLang] = createSignal(
        [{ label: "中文", value: "zh_cn" }].map((i) => {
            return { ...i, selected: Setting.language === i.value };
        })
    );
    const changeLanguage = (newLang: string) => {
        Setting.language = newLang;
        setLang((languages) => {
            return languages.map((i) => {
                return {
                    ...i,
                    selected: Setting.language === i.value,
                };
            });
        });
    };
    return (
        <Select
            data={languages()}
            onclick={(item) => {
                changeLanguage(item.value);
            }}
        >
            <div
                slot="trigger"
                className="w-full px-4  "
                style={{ fill: isDark() ? "white" : "black" }}
            >
                <LanguageOutline></LanguageOutline>
            </div>
        </Select>
    );
};
