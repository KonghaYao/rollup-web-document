import mitt from "mitt";

export const Setting = new Proxy(
    {
        language: "zh_cn",
    },
    {
        set(target, key, value) {
            const result = Reflect.set(target, key, value);
            if (result) watcher.emit(key as any, value);
            return result;
        },
    }
);
export const watcher = mitt<typeof Setting>();
