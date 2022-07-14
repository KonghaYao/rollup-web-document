import mitt from "mitt";
const origin = {
    language: "zh_cn",
};

const result = localStorage.getItem("document_setting");
if (result) {
    Object.assign(origin, JSON.stringify(result));
}
export const Setting = new Proxy(origin, {
    set(target, key, value) {
        const result = Reflect.set(target, key, value);
        if (result) watcher.emit(key as any, value);
        localStorage.setItem(JSON.stringify(origin));
        return result;
    },
});
export const watcher = mitt<typeof Setting>();
