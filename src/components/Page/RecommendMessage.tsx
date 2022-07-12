import { router } from "../../router/index";
import { Component, For } from "solid-js";
import { Setting } from "../../Setting";

export type RecommendMessage = {
    name: string;
    link: string;
    children: RecommendMessage;
}[];

/* 文章左侧推荐顺序 */
export const RecommendReading: Component<{ Pagination?: RecommendMessage }> = (
    props
) => {
    const now = router.getCurrentLocation().hashString;
    const pre = `/article/${Setting.language}`;
    const genArray = (arr: RecommendMessage) =>
        arr.map((i) => {
            const isNow = now.startsWith(pre + i.link);
            return {
                ...i,
                isNow,
            };
        });
    return (
        <aside class="flex-none px-2 border-r-2 border-gray-200 mr-4 hidden md:block">
            <For each={props.Pagination ? genArray(props.Pagination) : null}>
                {(item) => {
                    return (
                        <div class="px-2 py-1">
                            {/* 一级标题只是展示功能 */}
                            <div class="font-bold cursor-default">
                                {item.name}
                            </div>
                            <div>
                                <For
                                    each={
                                        item.children
                                            ? genArray(item.children)
                                            : null
                                    }
                                >
                                    {(ii) => {
                                        /* 二级标题具有点击功能 */
                                        return (
                                            <div
                                                class="text-sm cursor-pointer pl-2"
                                                classList={{
                                                    "bg-orange-400": ii.isNow,
                                                    "text-white": ii.isNow,
                                                }}
                                                onclick={() => {
                                                    !ii.isNow &&
                                                        router.navigate(
                                                            pre + ii.link
                                                        );
                                                }}
                                            >
                                                {ii.name}
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    );
                }}
            </For>
        </aside>
    );
};
