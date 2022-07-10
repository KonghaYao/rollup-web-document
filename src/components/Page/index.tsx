import { createMemo, lazy, onMount } from "solid-js";
import { RouterComponent } from "../../router";
export const Page: RouterComponent<{}> = (props) => {
    const params = createMemo(() => {
        const [params] = props.match.data as any as string[];
        return params;
    });

    return <div>{params}</div>;
};
