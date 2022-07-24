import { Component, createSignal, For } from "solid-js";
import { Setting } from "../../Setting";
import { SymbolParameter } from "../../Icon";

export const FontChange: Component<{}> = () => {
    const [fonts, setFont] = createSignal(
        [
            { label: "思源宋体", value: "Noto Serif SC" },
            { label: "默认黑体", value: " " },
        ].map((i) => {
            return { ...i, selected: Setting.font === i.value };
        })
    );
    return (
        <sl-dropdown class="z-10">
            <div slot="trigger" className="w-full px-4  ">
                <SymbolParameter></SymbolParameter>
            </div>
            <main class=" bg-white shadow-lg rounded-md mx-4 my-1 flex flex-col overflow-hidden">
                <For each={fonts()}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer px-2 py-1 whitespace-nowrap flex-none"
                                classList={{
                                    "bg-gray-100": item.selected,
                                }}
                                onclick={() => {
                                    Setting.font = item.value;
                                    setFont((languages) => {
                                        return languages.map((i) => {
                                            return {
                                                ...i,
                                                selected:
                                                    Setting.font === i.value,
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
