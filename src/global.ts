/** 配置 CDN 选项，如果使用 CDN 的话 */
export const isDev = () => globalThis.location.hostname === "127.0.0.1";
export const CDN = globalThis.location.href;
// NPM 插件 CDN 的根
export const NPM = "https://fastly.jsdelivr.net/npm/";
export const GH = "https://fastly.jsdelivr.net/gh/";
