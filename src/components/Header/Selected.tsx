import { Component, For } from "solid-js";

type ItemType = { selected?: boolean; label: string; value: any };
interface Props<T extends ItemType = ItemType> {
    data: T[];
    onclick: (item: T) => void;
}
export const Select: Component<Props> = (props) => {
    return (
        <sl-dropdown class="z-10">
            {props.children}
            <main class=" bg-white shadow-lg rounded-md mx-4 my-1 flex flex-col overflow-hidden w-24 ">
                <For each={props.data}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer px-4 py-2  whitespace-nowrap flex-none"
                                classList={{
                                    "bg-gray-50": item.selected,
                                    "text-lime-400": item.selected,
                                }}
                                onclick={() => props.onclick(item)}
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
