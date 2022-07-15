import { router } from "./index";
import { watcher } from "../Setting";
watcher.on("language", (newLang) => {
    const current = router.getCurrentLocation();
    const oldLang = current.data?.language;
    console.log(current.data);
    if (oldLang) {
        router.navigate(current.hashString.replace(oldLang, newLang));
    }
});
export {};
