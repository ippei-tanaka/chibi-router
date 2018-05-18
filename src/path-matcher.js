const WILDCARD = '___WILDCARD___';

export const buildMatcher = (pattern) => {

    if (typeof pattern !== 'string') {
        throw new SyntaxError('The pattern has to be string.');
    }

    const patternRegexp = constructPatternRegexp(pattern);
    const paramKeys = findParameterString(pattern);

    return (path) => {

        if (typeof path !== 'string') {
            throw new SyntaxError('The path has to be string.');
        }

        path = '/' + trimSlashes(path);

        const matched = path.match(patternRegexp);

        if (!matched) {
            return null;
        }

        const paramValues = matched.slice(1);
        let params = {};
        let wildcards = [];

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

const trimSlashes = (s) => {
    s = s.replace(/^\/*/, '');
    s = s.replace(/\/*$/, '');
    return s;
};

const findParameterString = (s) => {
    s = s.match(/(:[^/\s?#&=]+)|(\*)/g);
    let a = s || [];
    a = a.map(_s => _s.match(/([^/\s?:#&=]+)|(\*)/)[0]);
    a = a.map(_s => _s === '*' ? WILDCARD : _s);
    return a;
};

const constructPatternRegexp = (s) => {
    s = trimSlashes(s);
    s = replaceSpecialChars(s);
    s = '^\/?' + s + '\/?$';
    s = new RegExp(s);
    return s;
};

const replaceSpecialChars = (s) => {
    s = s.replace(/:[^/\s?#&=]+/g, '([^/\\s?#&=]+)');
    s = s.replace(/\/(\*)/g, '\/?$1');
    s = s.replace(/\*/g, '(.*)');
    return s;
};