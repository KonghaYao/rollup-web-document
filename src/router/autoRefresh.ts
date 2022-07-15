import { router } from "./index";
import { watcher } from "../Setting";
watcher.on("language", (newLang) => {
    const current = router.current![0];
    const oldLang = current.data?.language;
    console.log(router);
    if (oldLang) {
        router.navigate("/" + current.url.replace(oldLang, newLang));
    }
});
export {};
