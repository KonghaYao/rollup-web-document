import { router } from "../../router/index";
import { Component, For } from "solid-js";
import { Setting } from "../../Setting";

export type RecommendMessage = {
    name: string;
    link: string;
    children: RecommendMessage;
}[];
export const RecommendReading: Component<{ Pagination?: RecommendMessage }> = (
    props
) => {
    const now = router.getCurrentLocation().hashString;
    const pre = `/article/${Setting.language}`;
    return (
        <aside class="flex-none px-2 border-r-2 border-gray-200 mr-4 hidden md:block">
            <For
                each={props.Pagination?.map((i) => {
                    const isNow = now.startsWith(pre + i.link);
                    return {
                        ...i,
                        isNow,
                    };
                })}
            >
                {(item) => {
                    return (
                        <div
                            class="px-2 py-1"
                            classList={{
                                "bg-orange-400": item.isNow,
                                "text-white": item.isNow,
                            }}
                        >
                            {item.name}
                        </div>
                    );
                }}
            </For>
        </aside>
    );
};
