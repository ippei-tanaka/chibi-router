import pipe from 'ramda/src/pipe';
import defaultTo from 'ramda/src/defaultTo';
import drop from 'ramda/src/drop';

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

        const paramValues = drop(1, matched);
        let params = {};
        let wildcards = [];

        if (paramValues.length > 0) {
            paramKeys.forEach((paramKey, index) => {
                if (paramKey === WILDCARD_SYMBOL) {
                    wildcards.push(paramValues[index]);
                } else {
                    params[paramKey] = paramValues[index];
                }
            });
        }

        return {params, wildcards};
    };
};

const WILDCARD_SYMBOL = Symbol('*');

const trimSlashes = pipe(
    s => s.replace(/^\/*/, ''),
    s => s.replace(/\/*$/, '')
);

const findParameterString = pipe(
    s => s.match(/(:[^/\s?#&=]+)|(\*)/g),
    a => defaultTo([])(a),
    a => a.map(s => s.match(/([^/\s?:#&=]+)|(\*)/)[0]),
    a => a.map(s => s === '*' ? WILDCARD_SYMBOL : s)
);

const constructPatternRegexp = pipe(
    s => trimSlashes(s),
    s => replaceSpecialChars(s),
    s => '^\/?' + s + '\/?$',
    s => new RegExp(s),
);

const replaceSpecialChars = pipe(
    s => s.replace(/:[^/\s?#&=]+/g, '([^/\\s?#&=]+)'),
    s => s.replace(/\/(\*)/g, '\/?$1'),
    s => s.replace(/\*/g, '(.*)')
);