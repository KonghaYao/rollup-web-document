import { Page } from "./index";
import { RouterComponent } from "../../router/index";
import { createSignal, For } from "solid-js";
import { TOC } from "../../utils/createTOC";

export const PageWrapper: RouterComponent<{}> = (props) => {
    const [TOCList, setTOC] = createSignal<TOC>([]);
    return (
        <div class=" w-full bg-white p-4 rounded-lg select-text flex">
            <Page
                match={props.match}
                expose={(api) => {
                    setTOC(api.toc);
                }}
            ></Page>
            <div class="flex-none">
                <For each={TOCList()}>
                    {(item) => {
                        return <div class="cursor-pointer">{item.info}</div>;
                    }}
                </For>
            </div>
        </div>
    );
};
