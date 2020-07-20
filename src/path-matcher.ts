const WILDCARD = '___WILDCARD___';

export type Params = {
    [key:string]:string
};

export type Matches = {
    params:Params,
    wildcards:string[]
};

export const buildMatcher = (pattern:string) => {

    if (typeof pattern !== 'string') {
        throw new SyntaxError('The pattern has to be string.');
    }

    const patternRegexp = constructPatternRegexp(pattern);
    const paramKeys = findParameterString(pattern);

    return (path:string):Matches|null => {

        if (typeof path !== 'string') {
            throw new SyntaxError('The path has to be string.');
        }

        path = '/' + trimSlashes(path);

        const matched = path.match(patternRegexp);

        if (!matched) {
            return null;
        }

        const paramValues = matched.slice(1);
        let params:Params = {};
        let wildcards:string[] = [];

        if (paramValues.length > 0) {
            paramKeys.forEach((paramKey, index) => {
                if (paramKey === WILDCARD) {
                    wildcards.push(paramValues[index]);
                } else {
                    params[paramKey] = paramValues[index];
                }
            });
        }

        return {params, wildcards};
    };
};

const trimSlashes = (s:string) => {
    s = s.replace(/^\/*/, '');
    s = s.replace(/\/*$/, '');
    return s;
};

const findParameterString = (s:string) => {
    const tempS = s.match(/(:[^/\s?#&=]+)|(\*)/g);
    let a = tempS || [];
    a = a.map(_s => {
        const m = _s.match(/([^/\s?:#&=]+)|(\*)/);
        return m ? m[0] : ""
    });
    a = a.map(_s => _s === '*' ? WILDCARD : _s);
    return a;
};

const constructPatternRegexp = (s:string) => {
    s = trimSlashes(s);
    s = replaceSpecialChars(s);
    s = '^\/?' + s + '\/?$';
    return new RegExp(s);
};

const replaceSpecialChars = (s:string) => {
    s = s.replace(/:[^/\s?#&=]+/g, '([^/\\s?#&=]+)');
    s = s.replace(/\/(\*)/g, '\/?$1');
    s = s.replace(/\*/g, '(.*)');
    return s;
};
