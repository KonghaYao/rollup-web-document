import { render } from "solid-js/web";
import "./style/global.css";
import { Component, For, onMount } from "solid-js";
import { Link, Route, router } from "./router/index";
import { Setting } from "./Setting";
import { GithubInverted, LanguageOutline } from "./Icon";
import { PageWrapper } from "./components/Page/PageWrapper";

import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
const AppHeader: Component<{}> = () => {
    const languages = [{ label: "中文", value: "zh_cn" }];
    return (
        <header className="flex w-full justify-center bg-white border-b-2 border-red-200 px-4">
            <div className="w-full px-8 py-2 ">
                <div className="text-2xl">Doc of Rollup-Web</div>
            </div>
            <aside class="flex items-center mx-4">
                <Link
                    href={() => {
                        return `/article/${Setting.language}/Guide/index.mdx`;
                    }}
                >
                    <div className="w-full px-8 py-2 ">Guide</div>
                </Link>
                {/* Github 导航 */}
                <a
                    href="https://github.com/KonghaYao/rollup-web"
                    target="_blank"
                >
                    <GithubInverted className="w-full px-8 py-2 "></GithubInverted>
                </a>
                {/* 语言更换 */}
                <sl-dropdown>
                    <div slot="trigger" className="w-full px-4  ">
                        <LanguageOutline></LanguageOutline>
                    </div>
                    <main
                        class=" bg-white shadow-lg rounded-md mx-4 my-1 flex flex-col"
                        style="z-index:100"
                    >
                        <For each={languages}>
                            {(item) => {
                                return (
                                    <div
                                        class="cursor-pointer px-2 py-1 whitespace-nowrap flex-none"
                                        onclick={() => {
                                            Setting.language = item.value;
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                );
                            }}
                        </For>
                    </main>
                </sl-dropdown>
            </aside>
        </header>
    );
};

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
