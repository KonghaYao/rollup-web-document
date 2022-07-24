import mitt from "mitt";
const origin = {
    language: "zh_cn",
    font: "Noto Serif SC",
};

const result = localStorage.getItem("document_setting");
if (result) {
    Object.assign(origin, JSON.parse(result));
}
export const Setting = new Proxy(origin, {
    set(target, key, value) {
        const result = Reflect.set(target, key, value);
        if (result) watcher.emit(key as any, value);

        localStorage.setItem("document_setting", JSON.stringify(target));
        return result;
    },
});
export const watcher = mitt<typeof Setting>();
