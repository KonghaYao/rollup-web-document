import { Component } from "solid-js";
import { Link } from "../router/index";
import { Setting } from "../Setting";
import { GithubInverted } from "../Icon";

import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
import { FontChange } from "./Header/FontChange";
import { LanguageChange } from "./Header/LanguageChange";
import { isDark } from "../utils/isDark";
export const AppHeader: Component<{}> = () => {
    return (
        <header className="flex w-full justify-center bg-white dark:bg-slate-900 dark:text-gray-100 border-b-2 border-red-200 px-4">
            <Link href="/">
                <div className="w-full flex items-center px-8 py-2 ">
                    <img
                        class="h-8 w-8"
                        src="./src/assets/Rollup-Web.svg"
                        alt=""
                    />
                    <div className="ml-4 text-2xl font-bold">Rollup-Web</div>
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
                <LanguageChange></LanguageChange>
                <FontChange></FontChange>
            </aside>
        </header>
    );
};
