import {
    Component,
    createSignal,
    ErrorBoundary,
    JSX,
    lazy,
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
}> = (props) => {
    if (!props.src) throw new Error("你忘记 Embed 的 src 路径了");
    const type = props.type || props.src.replace(/.*\.([^\.]+?)$/, "$1");
    const Comp = lazy(async () => {
        return import(`/src/Support/${type}.tsx`);
    });
    return (
        <div>
            <ErrorBoundary
                fallback={(err, reset) => (
                    <ErrorPage err={err} reload={reset}></ErrorPage>
                )}
            >
                <ViewBox fallback={<div>白屏</div>}>
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
    timeout?: number;
    direction?: string;
    threshold?: string;
}> = (props) => {
    const [isInit, setInit] = createSignal(false);
    let io: IntersectionObserver;
    let root: HTMLDivElement;
    const init = () => {
        console.log("异步加载文件数据");
        setInit(true);
    };
    onMount(() => {
        if (!props.timeout) {
            // 根据滚动方向来构造视口外边距，用于提前加载
            let rootMargin: string;
            switch (props.direction) {
                case "horizontal":
                    rootMargin = `0px ${props.threshold}`;
                    break;
                default:
                    rootMargin = `${props.threshold} 0px`;
            }
            try {
                // 观察视口与组件容器的交叉情况
                io = new window.IntersectionObserver(
                    (entries) => {
                        if (
                            // 正在交叉
                            entries[0].isIntersecting ||
                            // 交叉率大于0
                            entries[0].intersectionRatio
                        ) {
                            init();
                            io.unobserve(root);
                        }
                    },
                    {
                        rootMargin,
                        root: null,
                        threshold: [0, Number.MIN_VALUE, 0.01],
                    }
                );
                io.observe(root);
            } catch (e) {
                init();
            }
        }
    });
    return (
        <div
            class="flex h-64 w-full bg-gray-50 rounded-2xl overflow-hidden"
            ref={root!}
        >
            <aside class="p-2 bg-blue-400 stroke-white">
                <Refresh
                    class="cursor-pointer select-none"
                    onclick={() => {
                        setInit(false);
                        console.log("点击成功");
                        setTimeout(() => setInit(true), 500);
                    }}
                ></Refresh>
            </aside>
            <Show when={isInit} fallback={props.fallback}>
                {() => props.children}
            </Show>
        </div>
    );
};
