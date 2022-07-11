import {
    Component,
    createSignal,
    onCleanup,
    onMount,
    Show,
    Suspense,
} from "solid-js";
import Navigo, { Match } from "navigo";
import { JSX } from "solid-js";
export const router = new Navigo("/", {
    hash: true,
});
export type RouterComponent<T> = Component<T & { match: Match }>;
/** 路由跳转组件 */
export const Link = (props: { href: string; element: JSX.Element }) => {
    const jumpTo = () => {
        router.navigate(props.href);
    };
    return (
        <a onclick={jumpTo}>
            <Suspense fallback={<p>Loading...</p>}>{props.element}</Suspense>
        </a>
    );
};
interface RouteProps {
    path: string | RegExp;
    element?: RouterComponent<any>;
    children?: JSX.Element;
}
/** 路由显示组件 */
export const Route: Component<RouteProps> = (props) => {
    const [matched, setMatched] = createSignal<Match | false>(false);
    /** 路由跳转的回调函数 */
    const cb = () => {};
    router.on(props.path, cb, {
        async before(next, match) {
            next();
            setMatched(match);
        },
        leave(done, match) {
            setMatched(false);
            done();
        },
    });

    onMount(() => {
        /** 必须在路由绑定之后再 match 才能 match 到 */
        const isCurrent = router.matchLocation(props.path) as Match;
        setMatched(isCurrent);
    });
    onCleanup(() => {
        router.off(cb);
    });
    return (
        <Show when={matched()}>
            {(match) => {
                if (typeof props.element === "function") {
                    return props.element({ match });
                } else {
                    return props.children;
                }
            }}
        </Show>
    );
};
