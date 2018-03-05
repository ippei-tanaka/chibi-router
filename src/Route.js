import pipe from 'ramda/src/pipe';
import defaultTo from 'ramda/src/defaultTo';
import drop from 'ramda/src/drop';
import head from 'ramda/src/head';

const constructSafePathString = pipe(
    s => s.replace(/^\/*/, ''),
    s => s.replace(/\/*$/, ''),
    s => '/' + s
);

const findParameterString = pipe(
    s => s.match(/:[^/\s?#&=]+/g),
    defaultTo([]),
    a => a.map(m => m.match(/[^/\s?:#&=]+/)[0])
);

const constructPattern = pipe(
    s => s.replace(/:[^/\s?#&=]+/g, '([^/\\s?#&=]+)'),
    s => '^' + s + '\/?$',
    s => new RegExp(s)
);

export const buildPathPatternObject = path => {
    if (typeof path !== 'string')
    {
        throw new SyntaxError('The argument has to be string.');
    }
    const pathStr = constructSafePathString(path);
    const pattern = constructPattern(pathStr);
    const paramKeys = findParameterString(pathStr);
    return {
        pattern,
        paramKeys
    };
};

export default class Route {

    constructor ()
    {
        const first = head(arguments);
        let path, handler;

        if (typeof first === 'string')
        {
            path = first;
            handler = arguments[1];
        } else {
            path = first.path;
            handler = first.handler;
        }

        const {pattern, paramKeys} = buildPathPatternObject(path);
        // this._path = path;
        this._pattern = pattern;
        this._paramKeys = paramKeys;
        this._handler = handler;
        Object.freeze(this);
    }

    // get path () { return this._path; }
    // get pattern () { return this._pattern; }
    // get paramKeys () { return this._paramKeys; }
    // get handler () { return this._handler; }

    match (testedPath)
    {
        if (typeof testedPath !== 'string')
        {
            throw new SyntaxError('The argument should be string.')
        }

        const matched = testedPath.match(this._pattern);

        if (!matched)
        {
            return null;
        }

        const paramValues = drop(1, matched);
        let params = {};

        if (paramValues.length > 0)
        {
            this._paramKeys.forEach((key, index) => {
                params[key] = paramValues[index]
            });
        }

        return this._handler({params});
    }
}