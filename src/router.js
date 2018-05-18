import {buildMatcher} from "./path-matcher";

export const buildRouter = (routes) => 
{
    if (typeof routes !== 'object' || routes === null) {
        throw new SyntaxError('routes should be a non-null object.');
    }

    const router = Object.keys(routes)
        .map(pattern => ({
            matcher: buildMatcher(pattern),
            handler: routes[pattern]
        }));

    return (path, ...rest) => {
        for (let i = 0; i < router.length; i++)
        {
            const {matcher, handler} = router[i];
            const matchedVars = matcher(path);
            if (matchedVars) {
                const {params, wildcards} = matchedVars;
                return handler({params, wildcards}, ...rest);
            }
        }
        return null;
    };
};