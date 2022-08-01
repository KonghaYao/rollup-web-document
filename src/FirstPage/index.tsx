import { router } from "../router/index";
export const FirstPage = () => {
    return (
        <div>
            {/* Logo */}
            <nav class="h-64 w-64 relative my-8">
                <div
                    class="absolute top-0 left-0 h-full w-full z-0"
                    style={{
                        filter: "blur(54px)",
                        background:
                            "linear-gradient(-45deg, rgb(98 72 227) , rgb(172 151 132) )",
                    }}
                ></div>
                <img
                    class="absolute top-0 left-0 w-full h-full z-10 "
                    src="/src/assets/Rollup-Web.svg"
                    style={{
                        transform: "translate(22%,11%)",
                    }}
                    alt=""
                />
            </nav>
            <nav class=" mt-24 mb-8 text-right">
                <span
                    class="text-4xl bg-clip-text text-transparent"
                    style={{
                        "background-image":
                            "linear-gradient(277deg, rgb(83 64 174), rgb(243 211 181))",
                    }}
                >
                    Rollup-Web
                </span>
                <div class="text-5xl my-4">浏览器端打包工具</div>
                <div class="text-gray-400">
                    我们在浏览器中实现了类似于 Vite 的打包工具！
                </div>
            </nav>
            <nav>
                <button
                    class="px-4 py-2  text-center rounded-3xl bg-lime-500 text-white"
                    onclick={() =>
                        router.navigate("/article/zh_cn/Guide/index.mdx")
                    }
                >
                    这里开始
                </button>
            </nav>
        </div>
    );
};
