import { Page } from "./index";
import { RouterComponent } from "../../router/index";
import { createSignal, For, onCleanup } from "solid-js";
import { NodeInfo, TOC } from "../../utils/createTOC";
import { highlightHub, highlightEL, scrollToID } from "./scrollToID";

export const PageWrapper: RouterComponent<{}> = (props) => {
    const [TOCList, setTOC] = createSignal<TOC>([]);
    const [readingID, setReading] = createSignal("");
    highlightHub.on("highlight", setReading);
    onCleanup(() => {
        highlightHub.off("highlight", setReading);
    });
    return (
        <div class=" w-full bg-white p-4 rounded-lg select-text flex">
            <Page
                onReading={(el, id) => {
                    highlightEL(el, id);
                }}
                match={props.match}
                expose={(api) => {
                    setTOC(api.toc);
                }}
            ></Page>
            <div class="flex-none">
                <For each={TOCList()}>
                    {(item) => {
                        return (
                            <div
                                class="cursor-pointer"
                                classList={{
                                    "cursor-pointer": true,
                                    "font-bold": readingID() === item.id,
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
        </div>
    );
};
