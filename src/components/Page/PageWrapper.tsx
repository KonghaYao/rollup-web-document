import { Page } from "./index";
import { RouterComponent } from "../../router/index";
import {
    Component,
    createResource,
    createSignal,
    For,
    onCleanup,
} from "solid-js";
import { NodeInfo, TOC } from "../../utils/createTOC";
import { highlightHub, highlightEL, scrollToID } from "./scrollToID";

export const PageWrapper: RouterComponent<{}> = (props) => {
    const [TOCList, setTOC] = createSignal<TOC>([]);
    const [readingID, setReading] = createSignal("");
    const [Pagination, setPagination] = createSignal<
        {
            name: string;
        }[]
    >();
    highlightHub.on("highlight", setReading);
    onCleanup(() => {
        highlightHub.off("highlight", setReading);
    });
    return (
        <div class=" w-full bg-white p-4 rounded-lg select-text flex">
            <aside class="flex-none m-4">
                <For each={Pagination()}>
                    {(item) => {
                        return <div>{item.name}</div>;
                    }}
                </For>
            </aside>
            <div class="w-full flex-flow flex justify-center">
                <Page
                    onReading={(el, id) => {
                        highlightEL(el, id);
                    }}
                    match={props.match}
                    expose={(api) => {
                        setTOC(api.toc);
                        setPagination(api.pagination);
                        console.log("mdx 导出", api);
                    }}
                ></Page>
            </div>
            <PageMark TOCList={TOCList()} readingID={readingID()}></PageMark>
        </div>
    );
};
const PageMark: Component<{
    TOCList: TOC;
    readingID: string;
}> = (props) => {
    return (
        <aside class="flex-none  ">
            <div class="font-bold">目录</div>
            <div class="overflow-auto h-full text-sm">
                <For each={props.TOCList}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer border-l-4 m-1 pl-2 line-camp-1 max-w-xs"
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
