import { Component, createSignal, mergeProps, onCleanup } from "solid-js";

export const Loading: Component<{
    message?: string;
    spinner?: string;
}> = (props) => {
    props = mergeProps(
        {
            message: "加载中。。。",
            spinner: "atom-spinner",
        },
        props
    );
    const el = document.createElement(props.spinner!);
    const [counter, setCounter] = createSignal(0);
    const tag = setInterval(() => setCounter((count) => count + 1), 1000);
    onCleanup(() => {
        clearInterval(tag);
    });
    return (
        <div className="h-full w-full flex-col flex justify-center items-center">
            {el}
            <span className="p-4">
                已等候 {counter()} 秒 - {props.message}
            </span>
        </div>
    );
};
