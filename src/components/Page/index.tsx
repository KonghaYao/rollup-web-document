import { createMemo, lazy, onMount, Suspense } from "solid-js";
import { RouterComponent } from "../../router";
import { MDXProvider } from "solid-jsx";
// const loader = (path: string) => {
//     return lazy(async () => {
//         return {
//             default: import(path),
//         };
//     });
// };
export const Page: RouterComponent<{}> = (props) => {
    const params = createMemo(() => {
        const [params] = props.match.data as any as string[];
        return params;
    });

    return (
        <div>
            {params}

            <Suspense>
                {
                    // loader("/doc/" + params)
                }
            </Suspense>
        </div>
    );
};
