import { Component } from "solid-js";

export const Embed: Component<{
    src: string;
    type?: string;
}> = (props) => {
    if (!props.src) throw new Error("你忘记 Embed 的 src 路径了");
    return <div>自动文件支持</div>;
};
