import {buildMatcher} from "./path-matcher";

export const buildRouter = (routes) => {
    if (typeof routes !== 'object' || routes === null) {
        throw new SyntaxError('routes should be a non-null object if it\'s not an array.');
    }

    const router = Object.keys(routes)
        .map(pattern => ({
            matcher: buildMatcher(pattern),
            handler: routes[pattern]
        }));

    return (path, context) => {
        for (let route of router)
        {
            const matchedVars = route.matcher(path);
            if (matchedVars) {
                const {params, wildcards} = matchedVars;
                return route.handler({params, wildcards, context});
            }
        }
        return null;
    };
};