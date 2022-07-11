import { createMemo, getOwner, lazy, onMount, Suspense } from "solid-js";
import { RouterComponent } from "../../router";
import { MDXProvider } from "solid-jsx";
import { Loading } from "../LoadingPage/loading";
import "../../style/markdown.css";
import { createTOC, TOC } from "../../utils/createTOC";
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

export const Page: RouterComponent<{
    expose(api: { [key: string]: any; toc: TOC }): void;
}> = (props) => {
    const [params] = props.match.data as any as string[];
    const [Inner, context] = loader("/doc/" + params);
    let el: HTMLDivElement;
    context().then((res: any) => {
        props.expose({ ...res, toc: createTOC(el, true) });
    });

    return (
        <div class="markdown-body max-w-2xl flex-grow" ref={el!}>
            <Suspense fallback={<Loading></Loading>}>
                <Inner></Inner>
            </Suspense>
        </div>
    );
};
