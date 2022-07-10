import { render } from "solid-js/web";
import "./style/global.css";
import { Page } from "./components/Page/index";
import { onMount } from "solid-js";
import { Route, router } from "./router/index";
const App = () => {
    onMount(() => {
        router.navigate(window.location.hash.replace("#", ""));
    });

    return (
        <section className="h-screen flex flex-col relative font-song select-none ">
            <header className="flex w-full justify-center bg-white ">
                <div className="w-full px-8 py-2 ">
                    <div className="text-2xl">DEMO-PAGES</div>
                </div>
            </header>

            <main className="flex-grow bg-gray-50 p-4 overflow-auto noise-bg">
                <Route path={/article\/(.*)/} element={Page}></Route>
                <Route path="/" element={<div>首页</div>}></Route>
            </main>
        </section>
    );
};
render(() => <App />, document.body);
