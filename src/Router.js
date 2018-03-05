import Route from "./Route";

export default class Router {

    constructor(routes) {
        if (routes instanceof Array) {
            this._routes = routes.map(route => new Route(route));
        } else if (typeof routes === 'object' && routes !== null) {
            this._routes = Object.keys(routes)
                .map(key => new Route({path: key, handler: routes[key]}));
        } else {
            throw new SyntaxError('routes should be a non-null object if it\'s not an array.');
        }
    }

    execute(path) {
        return new Promise((resolve, reject) => {
            for (let route of this._routes)
            {
                const matched = route.match(path);
                if (matched) return resolve(matched);
            }
            return reject();
        });
    }
}