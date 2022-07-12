import {
    createMemo,
    getOwner,
    lazy,
    onCleanup,
    onMount,
    Suspense,
} from "solid-js";
import { RouterComponent } from "../../router";
import { MDXProvider } from "solid-jsx";
import { Loading } from "../LoadingPage/loading";
import "../../style/markdown.css";
import { createTOC, TOC } from "../../utils/createTOC";
import throttle from "lodash-es/throttle";
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
export const Page: RouterComponent<{
    onReading: (el: HTMLElement, id: string) => void;
    expose(api: { [key: string]: any; toc: TOC }): void;
}> = (props) => {
    const [params] = props.match.data as any as string[];
    const [Inner, context] = loader("/doc/" + params);
    let el: HTMLDivElement;
    let tagEl: HTMLElement[];
    context().then((res: any) => {
        const [toc, els] = createTOC(el, true);
        tagEl = els;
        props.expose({ ...res, toc });

        /* 返回滚动位置 */
        const position = new URL(
            router.getCurrentLocation().hashString,
            location.origin
        ).searchParams.get("position");
        position && scrollToID(position);
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
            class="markdown-body max-w-2xl flex-grow relative h-full overflow-auto"
            ref={el!}
            onScroll={ScrollControl}
        >
            <Suspense fallback={<Loading></Loading>}>
                <Inner></Inner>
            </Suspense>
        </div>
    );
};
