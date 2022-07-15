import { Component, createSignal, For } from "solid-js";
import { Link } from "../router/index";
import { Setting } from "../Setting";
import { GithubInverted, LanguageOutline } from "../Icon";

import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
export const AppHeader: Component<{}> = () => {
    const [languages, setLang] = createSignal(
        [
            { label: "中文", value: "zh_cn" },
            { label: "English", value: "en" },
        ].map((i) => {
            return { ...i, selected: Setting.language === i.value };
        })
    );

    return (
        <header className="flex w-full justify-center bg-white border-b-2 border-red-200 px-4">
            <Link href="/">
                <div className="w-full px-8 py-2 ">
                    <div className="text-2xl">Doc of Rollup-Web</div>
                </div>
            </Link>
            <aside class="flex items-center mx-4">
                <Link
                    href={() => {
                        return `/article/${Setting.language}/Guide/index.mdx`;
                    }}
                >
                    <nav className="w-full px-8 py-2 ">Guide</nav>
                </Link>
                {/* Github 导航 */}
                <a
                    href="https://github.com/KonghaYao/rollup-web"
                    target="_blank"
                >
                    <GithubInverted className="w-full px-8 py-2 "></GithubInverted>
                </a>
                {/* 语言更换 */}
                <sl-dropdown class="z-10">
                    <div slot="trigger" className="w-full px-4  ">
                        <LanguageOutline></LanguageOutline>
                    </div>
                    <main class=" bg-white shadow-lg rounded-md mx-4 my-1 flex flex-col overflow-hidden">
                        <For each={languages()}>
                            {(item) => {
                                return (
                                    <div
                                        class="cursor-pointer px-2 py-1 whitespace-nowrap flex-none"
                                        classList={{
                                            "bg-gray-100": item.selected,
                                        }}
                                        onclick={() => {
                                            Setting.language = item.value;
                                            setLang((languages) => {
                                                return languages.map((i) => {
                                                    return {
                                                        ...i,
                                                        selected:
                                                            Setting.language ===
                                                            i.value,
                                                    };
                                                });
                                            });
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