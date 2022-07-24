import {
    Component,
    createSignal,
    ErrorBoundary,
    JSX,
    lazy,
    onCleanup,
    onMount,
    Show,
    Suspense,
} from "solid-js";
import { ErrorPage } from "../components/LoadingPage/ErrorPage";
import { Loading } from "../components/LoadingPage/loading";
import { Refresh } from "../Icon";
import { absolutePath } from "../utils/isURLString";
export const Embed: Component<{
    src: string;
    type?: string;
    autoheight?: boolean;
}> = (props) => {
    if (!props.src) throw new Error("你忘记 Embed 的 src 路径了");
    const type = props.type || props.src.replace(/.*\.([^\.]+?)$/, "$1");
    const Comp = lazy(async () => {
        return import(absolutePath(`./src/Support/${type}.tsx`));
    });
    return (
        <div class="my-8 ">
            <ErrorBoundary
                fallback={(err, reset) => (
                    <ErrorPage err={err} reload={reset}></ErrorPage>
                )}
            >
                <ViewBox
                    fallback={<Loading message="预加载窗口"></Loading>}
                    autoheight={props.autoheight}
                >
                    <Suspense
                        fallback={
                            <Loading message="加载 Embed 文件中"></Loading>
                        }
                    >
                        <Comp {...props} src={absolutePath(props.src)}></Comp>
                    </Suspense>
                </ViewBox>
            </ErrorBoundary>
        </div>
    );
};
const ViewBox: Component<{
    fallback: JSX.Element;
    autoheight?: boolean;
}> = (props) => {
    const [isInit, setInit] = createSignal(false);
    let io: IntersectionObserver;
    let root: HTMLDivElement;
    const init = () => {
        console.log("Embed Plugin Support: ");
        setInit(true);
    };
    onMount(() => {
        // 观察视口与组件容器的交叉情况
        io = new window.IntersectionObserver(
            (entries) => {
                if (
                    // 正在交叉
                    entries[0].isIntersecting
                ) {
                    setTimeout(() => {
                        init();
                    }, 500);
                    io.unobserve(entries[0].target);
                }
            },
            {
                rootMargin: "0px",
                root: null,
                threshold: 0,
            }
        );
        io.observe(root);
    });
    onCleanup(() => {
        io && io.disconnect();
    });
    return (
        <main
            class="flex w-full bg-gray-50 rounded-lg overflow-hidden "
            classList={{ [props.autoheight ? "min-h-64" : "h-64"]: true }}
            ref={root!}
        >
            <div class="p-2 bg-blue-400 stroke-white h-full flex flex-col">
                <Refresh onclick={() => {}}></Refresh>
            </div>
            <Show when={isInit()} fallback={props.fallback}>
                {props.children}
            </Show>
        </main>
    );
};
