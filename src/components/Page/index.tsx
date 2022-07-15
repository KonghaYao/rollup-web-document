import { lazy, onCleanup, onMount, Suspense } from "solid-js";
import { RouterComponent } from "../../router";
import { MDXProvider } from "solid-jsx";
import { Loading } from "../LoadingPage/loading";
import "../../style/markdown.css";
import { createTOC, TOC } from "../../utils/createTOC";
import throttle from "lodash-es/throttle";

/* 加载动态 mdx */
const loader = (path: string) => {
    let ready: any;
    let context = new Promise((resolve) => {
        ready = resolve;
    });
    return [
        lazy(async () => {
            return import(path).then((res) => {
                const { default: Comp, ...last } = res;
                return {
                    default: () => {
                        onMount(() => ready(last));
                        return (
                            <MDXProvider>
                                <Comp></Comp>
                            </MDXProvider>
                        );
                    },
                };
            });
        }),
        () => context,
    ] as const;
};
import { router } from "../../router/index";
import { scrollToID, setScrollID } from "./scrollToID";
import { PrismSupport } from "../../utils/PrismSupport";

/* MDX 的一个包装器 */
export const Page: RouterComponent<{
    onReading: (el: HTMLElement, id: string) => void;
    expose(api: { [key: string]: any; toc: TOC }): void;
}> = (props) => {
    const params = props.match.url
        .replace("article", "/doc")
        .replace(/\?.*/, "");
    const [Inner, context] = loader(params);
    let el: HTMLDivElement;
    let tagEl: NodeListOf<HTMLElement>;
    context().then((res: any) => {
        const [toc, els] = createTOC(el, true);
        /* @ts-ignore */
        tagEl = els;
        props.expose({
            ...res,
            toc,
        });
        PrismSupport(el);
        /* 返回滚动位置 */
        const position = new URL(
            router.getCurrentLocation().hashString,
            location.origin
        ).searchParams.get("position");
        // 这个位置不能 smooth ，因为动画会导致其他懒加载被触发
        scrollToID(position ? position : toc[0].id, false);
    });
    onCleanup(() => {
        /* @ts-ignore */
        tagEl = null;
        /* @ts-ignore */
        el = null;
    });
    /* 监控用户滚动位置 */
    const ScrollControl = throttle((e: Event) => {
        const scrollTop = el.scrollTop;
        const closest = [...tagEl]
            .map((now) => {
                return { el: now, diff: Math.abs(scrollTop - now.offsetTop) };
            })
            .sort((a, b) => a.diff - b.diff)[0].el;

        const id = closest.dataset.info;
        setScrollID(id!);
        props.onReading(closest, id!);
    }, 300);
    return (
        <div
            class="markdown-body max-w-2xl w-full flex-grow relative h-full overflow-y-auto overflow-x-hidden"
            ref={el!}
            onScroll={ScrollControl}
        >
            <Suspense fallback={<Loading></Loading>}>
                <Inner></Inner>
            </Suspense>
            {props.children}
        </div>
    );
};
