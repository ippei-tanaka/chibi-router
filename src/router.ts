import {buildMatcher, Matches} from "./path-matcher";

export type Routes<T> = {
    [key:string]: (matches:Matches, ...rest:any) => T
};

type RouteHandler<R> = {
  matcher: (path:string) => Matches | null,
  handler: (matches:Matches, ...rest:any) => R,
};

export class Router<R>
{
  private router:RouteHandler<R>[] = [];

  constructor (routes:Routes<R>)
  {
    for (let key of Object.keys(routes))
    {
      this.addRoute(key, routes[key]);
    }
  }

  addRoute (path:string, callback:(matches:Matches, ...rest:any) => R)
  {
    this.router = [...this.router, {
      matcher: buildMatcher(path),
      handler: callback
    }];
  }

  findRoute (path:string, ...rest:any)
  {
    for (let i = 0; i < this.router.length; i++)
    {
        const {matcher, handler} = this.router[i];
        const matchedVars = matcher(path);
        if (matchedVars) {
            const {params, wildcards} = matchedVars;
            return handler({params, wildcards}, ...rest);
        }
    }
    return null;
  }
}

/*
export const buildRouter = (routes:Routes<any>|null) =>
{
    if (typeof routes !== 'object' || routes === null) {
        throw new SyntaxError('routes should be a non-null object.');
    }

    const router = Object.keys(routes)
        .map(pattern => ({
            matcher: buildMatcher(pattern),
            handler: routes[pattern]
        }));

    return (path:string, ...rest:any) => {
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
*/
