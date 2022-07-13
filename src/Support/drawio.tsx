import {
    Component,
    createEffect,
    createResource,
    Match,
    on,
    onMount,
    Show,
    Switch,
} from "solid-js";
import { Loading } from "../components/LoadingPage/loading";
import { GH } from "../global";
import { loadScript } from "../utils/loadScript";
import { useGlobal } from "../utils/useGlobal";
await loadScript(GH + "jgraph/drawio/src/main/webapp/js/viewer.min.js");
export const Drawio: Component<{ src: string }> = (props) => {
    const [xml, { mutate: setXML, refetch }] = createResource(() => {
        return fetch(props.src).then((res) => res.text());
    });
    const GraphViewer = useGlobal<any>("GraphViewer");
    const mxUtils = useGlobal<any>("mxUtils");
    let container: HTMLDivElement;
    let Graph: any;

    createEffect(
        on(xml, () => {
            const config = {
                editable: false,
                highlight: "#0000ff",
                nav: false,
                center: true,
                edit: null,
                resize: true,
                move: true,
                responsive: true,
                zoomEnabled: true,
                ...props,
                xml: xml(),
            };
            if (Graph) {
                Graph.graph.destroy();
                Graph.editor.destroy();
            }
            if (xml()) {
                Graph = new GraphViewer(
                    container,
                    mxUtils.parseXml(xml()).documentElement,
                    config
                );
            }
        })
    );

    return (
        <div>
            <Show when={xml.loading}>
                <div class="z-50 absolute top-0 left-0 h-full w-full backdrop-blur-sm">
                    <Loading></Loading>
                </div>
            </Show>
            <div ref={container!}></div>
        </div>
    );
};
