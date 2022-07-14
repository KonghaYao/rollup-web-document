import { Component, For } from "solid-js";
import { TOC } from "../../utils/createTOC";
import { scrollToID } from "./scrollToID";
/* 文章右侧的目录模块 */
export const PageMark: Component<{
    TOCList: TOC;
    readingID: string;
}> = (props) => {
    return (
        <aside class="flex-none hidden lg:block mx-2">
            <div class="font-bold">目录</div>
            <div class="overflow-auto h-full text-sm">
                <For each={props.TOCList}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer border-l-4 m-1 pl-2 line-camp-1 max-w-lg "
                                classList={{
                                    "font-bold": props.readingID === item.id,
                                    "border-orange-400":
                                        props.readingID === item.id,
                                }}
                                onclick={() => {
                                    scrollToID(item.id);
                                }}
                            >
                                {item.info}
                            </div>
                        );
                    }}
                </For>
            </div>
        </aside>
    );
};
