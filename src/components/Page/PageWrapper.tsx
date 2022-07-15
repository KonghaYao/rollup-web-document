import { Page } from "./index";
import { RouterComponent } from "../../router/index";
import { createSignal, onCleanup, Show } from "solid-js";
import { TOC } from "../../utils/createTOC";
import { highlightHub, highlightEL } from "./scrollToID";
import { PageMark } from "./PageMark";
import { RecommendMessage, RecommendReading } from "./RecommendMessage";
/* 文章页面封装 */
export const PageWrapper: RouterComponent<{}> = (props) => {
    const [TOCList, setTOC] = createSignal<TOC>([]);
    const [readingID, setReading] = createSignal("");
    const [Pagination, setPagination] = createSignal<RecommendMessage[]>();
    const [RecommendVisible] = createSignal(true);
    highlightHub.on("highlight", setReading);
    onCleanup(() => {
        highlightHub.off("highlight", setReading);
    });
    return (
        <div class=" w-full bg-white p-4 rounded-lg select-text flex">
            <Show when={RecommendVisible}>
                <RecommendReading Pagination={Pagination()}></RecommendReading>
            </Show>
            <div class="w-full flex-flow flex flex-col items-center overflow-hidden">
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
                >
                    {/* 文章底部栏 */}
                    <div class="h-24 w-full"></div>
                </Page>
            </div>
            <PageMark TOCList={TOCList()} readingID={readingID()}></PageMark>
        </div>
    );
};
