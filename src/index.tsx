import { render } from "solid-js/web";
import "./style/global.css";
import { onMount } from "solid-js";
import { Link, Route, router } from "./router/index";
import { Setting } from "./Setting";
import { PageWrapper } from "./components/Page/PageWrapper";

const App = () => {
    onMount(() => {
        router.navigate(window.location.hash.slice(1));
    });

    return (
        <section className="h-screen flex flex-col relative font-song select-none ">
            <header className="flex w-full justify-center bg-white border-b-2 border-red-200 ">
                <div className="w-full px-8 py-2 ">
                    <div className="text-2xl">Doc of Rollup-Web</div>
                </div>
                <Link
                    href={() => {
                        return `/article/${Setting.language}/Guide/index.mdx`;
                    }}
                >
                    <div className="w-full px-8 py-2 ">Guide</div>
                </Link>
            </header>

            <main className="flex-grow bg-gray-50  p-4  overflow-auto flex justify-center">
                <Route path={/article\/(.*)/} element={PageWrapper}></Route>

                <Route path="/">
                    <div>首页</div>
                </Route>
            </main>
        </section>
    );
};
render(() => <App />, document.body);
