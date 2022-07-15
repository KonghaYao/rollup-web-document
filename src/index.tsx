import { render } from "solid-js/web";
import "./style/global.css";
import { onMount } from "solid-js";
import { Route, router } from "./router/index";
import { PageWrapper } from "./components/Page/PageWrapper";
import "./router/autoRefresh";
import { AppHeader } from "./components/AppHeader";
const App = () => {
    onMount(() => {
        router.navigate(window.location.hash.slice(1));
    });

    return (
        <section className="h-screen flex flex-col relative font-song select-none ">
            <AppHeader></AppHeader>
            <main className="flex-grow bg-gray-50  p-4  overflow-auto flex justify-center">
                <Route
                    path={"/article/:language/***" || /article\/(.*)/}
                    element={PageWrapper}
                ></Route>

                <Route path="/">
                    <div>首页</div>
                </Route>
            </main>
        </section>
    );
};
render(() => <App />, document.body);
