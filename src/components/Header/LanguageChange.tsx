import { Component, createSignal, For } from "solid-js";
import { Setting } from "../../Setting";
import { LanguageOutline } from "../../Icon";
import { Select } from "./Selected";
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
                changeLanguage(item);
            }}
        >
            <div slot="trigger" className="w-full px-4  ">
                <LanguageOutline></LanguageOutline>
            </div>
        </Select>
    );
};
