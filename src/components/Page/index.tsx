import { createMemo, createSignal, lazy, onMount, Suspense } from "solid-js";
import { RouterComponent } from "../../router";
import { MDXProvider } from "solid-jsx";
import { Loading } from "../LoadingPage/loading";
import "../../style/markdown.css";
const loader = (path: string) => {
    let ready: any;
    let context = new Promise((resolve) => {
        ready = resolve;
    });
    return [
        lazy(async () => {
            return import(path).then((res) => {
                const { default: Comp, ...last } = res;
                ready(last);
                return {
                    default: () => (
                        <MDXProvider>
                            <Comp></Comp>
                        </MDXProvider>
                    ),
                };
            });
        }),
        () => context,
    ] as const;
};
export const Page: RouterComponent<{}> = (props) => {
    const params = createMemo(() => {
        const [params] = props.match.data as any as string[];
        return params;
    });
    const [Inner, context] = loader("/doc/" + params());
    context().then((res) => {
        console.log(res);
    });
    return (
        <div class="markdown-body">
            <Suspense fallback={<Loading></Loading>}>
                <Inner></Inner>
            </Suspense>
        </div>
    );
};
