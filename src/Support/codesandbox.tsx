import { Component } from "solid-js";
import { GH } from "../global";
import { loadScript } from "../utils/loadScript";
await loadScript(GH + "jgraph/drawio/src/main/webapp/js/viewer.min.js");

export const Drawio: Component<{ id: string }> = (props) => {
    return (
        <iframe
            src={`https://codesandbox.io/embed/${props.id}?autoresize=1&expanddevtools=1&fontsize=14&theme=light`}
            style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
    );
};

export default Drawio;
