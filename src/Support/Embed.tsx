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
export const Embed: Component<{
    src: string;
    type?: string;
    autoheight?: boolean;
}> = (props) => {
    if (!props.src) throw new Error("你忘记 Embed 的 src 路径了");
    const type = props.type || props.src.replace(/.*\.([^\.]+?)$/, "$1");
    const Comp = lazy(async () => {
        return import(`/src/Support/${type}.tsx`);
    });
    return (
        <div class="my-2 ">
            <ErrorBoundary
                fallback={(err, reset) => (
                    <ErrorPage err={err} reload={reset}></ErrorPage>
                )}
            >
                <ViewBox
                    fallback={<div>白屏</div>}
                    autoheight={props.autoheight}
                >
                    <Suspense
                        fallback={
                            <Loading message="加载 Embed 文件中"></Loading>
                        }
                    >
                        <Comp {...props}></Comp>
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
        console.log("异步加载文件数据");
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
                    }, 300);
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
        <div
            class="flex w-full bg-gray-50 rounded-lg overflow-hidden"
            classList={{ "h-64": !props.autoheight }}
            ref={root!}
        >
            <div class="p-2 bg-blue-400 stroke-white h-full flex flex-col">
                <Refresh class="" onclick={() => {}}></Refresh>
            </div>
            <Show when={isInit()} fallback={props.fallback}>
                {props.children}
            </Show>
        </div>
    );
};
