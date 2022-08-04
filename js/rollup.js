import { Evaluator } from "https://cdn.jsdelivr.net/npm/rollup-web@4.6.6/dist/index.js";

const Eval = new Evaluator();
console.time("Worker构建时间");
await Eval.useWorker("./js/bundle_worker.js");
console.timeEnd("Worker构建时间");
await Eval.createEnv({});

// 开始执行打包操作
console.time("初次打包时间");
await Eval.evaluate("./src/index.tsx");
console.timeEnd("初次打包时间");
// 去除等候页面
globalThis.PrepareDestroy();
