import { Component } from "solid-js";

export const Sandbox: Component<{ src: string }> = (props) => {
    return (
        <div
            class="w-full"
            style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        >
            <iframe
                src={props.src}
                style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>
        </div>
    );
};

export default Sandbox;
