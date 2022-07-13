import { Component, createSignal, mergeProps, onCleanup } from "solid-js";
import "wc-spinners";
export const Loading: Component<{
    message?: string;
}> = (props) => {
    props = mergeProps(
        {
            message: "加载中。。。",
        },
        props
    );
    const [counter, setCounter] = createSignal(0);
    const tag = setInterval(() => setCounter((count) => count + 1), 1000);
    onCleanup(() => {
        clearInterval(tag);
    });
    return (
        <div className="h-full w-full flex-col flex justify-center items-center">
            <intersecting-circles-spinner color="#fb923c"></intersecting-circles-spinner>
            <span className="p-4">
                已等候 {counter()} 秒 - {props.message}
            </span>
        </div>
    );
};
