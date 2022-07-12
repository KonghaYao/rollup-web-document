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
                        onMount(() => {
                            ready(last);
                        });
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
import { scrollToID } from "./scrollToID";
export const Page: RouterComponent<{
    onMoveTo: (el: HTMLElement) => void;
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
    const ScrollControl = throttle((e: Event) => {
        for (let i of tagEl) {
            const offset = i.getBoundingClientRect().y;
            if (offset > -50 && offset < 100) {
                console.log(i.dataset.info);
                const fake = new URL(
                    router.getCurrentLocation().hashString,
                    location.origin
                );
                fake.searchParams.set("position", i.dataset.info!);
                const hash = fake.toString().replace(location.origin, "");
                router.navigate(hash, {
                    callHooks: false,
                });
                break;
            }
        }
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
