import { Component, createSignal, For } from "solid-js";
import { Setting } from "../../Setting";
import { LanguageOutline } from "../../Icon";

export const LanguageChange: Component<{}> = () => {
    const [languages, setLang] = createSignal(
        [{ label: "中文", value: "zh_cn" }].map((i) => {
            return { ...i, selected: Setting.language === i.value };
        })
    );
    return (
        <sl-dropdown class="z-10">
            <div slot="trigger" className="w-full px-4  ">
                <LanguageOutline></LanguageOutline>
            </div>
            <main class=" bg-white shadow-lg rounded-md mx-4 my-1 flex flex-col overflow-hidden">
                <For each={languages()}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer px-2 py-1 whitespace-nowrap flex-none"
                                classList={{
                                    "bg-gray-100": item.selected,
                                }}
                                onclick={() => {
                                    Setting.language = item.value;
                                    setLang((languages) => {
                                        return languages.map((i) => {
                                            return {
                                                ...i,
                                                selected:
                                                    Setting.language ===
                                                    i.value,
                                            };
                                        });
                                    });
                                }}
                            >
                                {item.label}
                            </div>
                        );
                    }}
                </For>
            </main>
        </sl-dropdown>
    );
};
