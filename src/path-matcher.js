import pipe from 'ramda/src/pipe';
import defaultTo from 'ramda/src/defaultTo';
import drop from 'ramda/src/drop';

const WILDCARD_SYMBOL = Symbol('*');

const constructSafePathString = pipe(
    s => s.replace(/^\/*/, ''),
    s => s.replace(/\/*$/, ''),
    s => '/' + s
);

const findParameterString = pipe(
    s => s.match(/(:[^/\s?#&=]+)|(\*)/g),
    m => defaultTo([])(m),
    a => a.map(s => s.match(/([^/\s?:#&=]+)|(\*)/)[0]),
    a => a.map(s => s === '*' ? WILDCARD_SYMBOL : s)
);

const constructPattern = pipe(
    s => s.replace(/:[^/\s?#&=]+/g, '([^/\\s?#&=]+)'),
    s => s.replace(/\*/g, '(.*)'),
    s => '^' + s + '\/?$',
    s => new RegExp(s)
);

const extractPattern = pattern => {
    if (typeof pattern !== 'string')
    {
        throw new SyntaxError('The argument has to be string.');
    }
    const pathStr = constructSafePathString(pattern);
    const regexp = constructPattern(pathStr);
    const paramKeys = findParameterString(pathStr);
    return {
        regexp,
        paramKeys
    };
};

export const buildMatcher = (pattern) =>
{
    const {regexp, paramKeys} = extractPattern(pattern);

    return (path) => {

        if (typeof path !== 'string')
        {
            throw new SyntaxError('The argument should be string.')
        }

        path = constructSafePathString(path);

        const matched = path.match(regexp);

        if (!matched)
        {
            return null;
        }

        const paramValues = drop(1, matched);
        let params = {};
        let wildcards = [];

        if (paramValues.length > 0)
        {
            paramKeys.forEach((key, index) => {
                if (key === WILDCARD_SYMBOL)
                {
                    wildcards.push(paramValues[index]);
                } else {
                    params[key] = paramValues[index];
                }
            });
        }

        return {params, wildcards};
    }
};

export const match = (pattern, path) => buildMatcher(pattern)(path);