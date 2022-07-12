export type NodeInfo = {
    id: string;
    order: number;
    children: NodeInfo[];
    info: string | null;
};
export type TOC = NodeInfo[];
const addTo = (now: NodeInfo, list: NodeInfo[], root: NodeInfo[]) => {
    const last = list.at(-1);
    const order = now.order;
    if (last) {
        if (last.order === order) {
            // 同级向后迁移
            list.push(now);
        } else if (last.order > order) {
            // 低级延伸
            addTo(now, last.children, root);
        } else {
            // 高级创建
            root.push(now);
        }
    } else {
        list.push(now);
    }
};
export const createTOC = (el: Element | Node, flat: true) => {
    const list: NodeInfo[] = [];

    const els = (el as any).querySelectorAll("h1,h2,h3,h4,h5,h6");
    els.forEach((el: HTMLHeadingElement, index: number) => {
        const order = parseInt(el.tagName[1]);
        const id = btoa(el.textContent || "").slice(0, 5) + index;
        el.dataset.info = id;
        const now = { id, order, info: el.textContent, children: [] };
        flat ? list.push(now) : addTo(now, list, list);
    });
    return [list, els];
};
