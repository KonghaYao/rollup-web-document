import { render } from "solid-js/web";
import "./style/global.css";
import { onMount } from "solid-js";
import { Route, router } from "./router/index";
import { PageWrapper } from "./components/Page/PageWrapper";
import "./router/autoRefresh";
import { AppHeader } from "./components/AppHeader";
import { FirstPage } from "./FirstPage/index";
const App = () => {
    onMount(() => {
        router.navigate(window.location.hash.slice(1));
    });

    return (
        <section className="h-screen flex flex-col relative  select-none dark:bg-slate-900 dark:text-slate-50">
            <AppHeader></AppHeader>
            <main className="flex-grow bg-gray-50 dark:bg-slate-800 p-4  overflow-auto flex justify-center">
                <Route
                    path={"/article/:language/***" || /article\/(.*)/}
                    element={PageWrapper}
                ></Route>

                <Route path="/">
                    <FirstPage></FirstPage>
                </Route>
            </main>
        </section>
    );
};
render(() => <App />, document.body);
