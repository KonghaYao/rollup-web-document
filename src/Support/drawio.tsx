import {
    Component,
    createEffect,
    createResource,
    Match,
    on,
    onCleanup,
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
            if (!xml()) return;
            if (Graph && xml() === Graph.xml) return;
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
            const XMLD = mxUtils.parseXml(xml()).documentElement;
            Graph = new GraphViewer(container, XMLD, config);
            console.log(Graph);
        })
    );
    onCleanup(() => {
        if (Graph) {
            Graph.graph.destroy();
            Graph.editor.destroy();
        }
    });
    return (
        <div class="flex-grow overflow-hidden flex justify-center items-center w-full">
            <Show when={xml.loading}>
                <Loading></Loading>
            </Show>
            <div class="container h-full w-full" ref={container!}></div>
        </div>
    );
};

export default Drawio;
