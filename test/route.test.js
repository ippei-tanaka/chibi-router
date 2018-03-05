import Route, {buildPathPatternObject} from '../src/Route';

describe('buildPathPatternObject', () => {
    it('should build a RegExp instance', () => {
        expect('/').toMatch(buildPathPatternObject('/').pattern);
        expect('/users/this-is-id/name').toMatch(buildPathPatternObject('/users/:id/name').pattern);
        expect('/categories/my-cat-id/posts/my-post-id/').toMatch(buildPathPatternObject('categories/:categoryId/posts/:postId/').pattern);
    });
});

describe('Router', () => {
    describe('match', () => {
        it('should return the value returned by the handler when a path matched', () => {
            const route1 = new Route('/',  () => 'a');
            expect(route1.match('/')).toBe('a');

            const route2 = new Route('/users/:id',  ({params: {id}}) => 'The id is ' + id);
            expect(route2.match('/users/001')).toBe('The id is 001');

            const route3 = new Route('/users/:userId/test/:testId',  ({params: {userId, testId}}) => `${userId} ${testId}`);
            expect(route3.match('/users/123/test/456')).toBe('123 456');
        });

        it('should return a Promise object if the handler is an async function', async () => {
            const route1 = new Route('/',  async () => 'a');
            expect(await route1.match('/')).toBe('a');

            const route2 = new Route('/users/:id',  async ({params: {id}}) => 'The id is ' + id);
            expect(await route2.match('/users/001')).toBe('The id is 001');

            const route3 = new Route('/users/:userId/test/:testId',  async ({params: {userId, testId}}) => `${userId} ${testId}`);
            expect(await route3.match('/users/123/test/456')).toBe('123 456');
        });
    });
});