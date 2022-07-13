import {
    Component,
    createSignal,
    JSX,
    lazy,
    onMount,
    Show,
    Suspense,
} from "solid-js";
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
            <ViewBox fallback={<div>白屏</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Comp {...props}></Comp>
                </Suspense>
            </ViewBox>
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
        <div class="flex h-64 w-full" ref={root!}>
            <aside>
                <div>控制栏</div>
            </aside>
            <Show when={isInit} fallback={props.fallback}>
                {() => props.children}
            </Show>
        </div>
    );
};
