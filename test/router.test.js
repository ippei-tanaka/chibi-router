import Router from '../src/Router';

describe('Router', () => {
    it('should invoke a corresponding handler', async () => {
        const router = new Router([
            {
                path: '/',
                handler: () => {
                    return 'a';
                }
            },
            {
                path: '/test',
                handler: () => {
                    return 'b';
                }
            }
        ]);

        const value1 = await router.execute('/');
        expect(value1).toBe('a');

        const value2 = await router.execute('/test');
        expect(value2).toBe('b');

        const value3 = await router.execute('/else').catch(() => 'Not Found');
        expect(value3).toBe('Not Found');
    });

    it('should take an route object as an argument of the constructor', async () => {
        const router = new Router({
            '/': () => {
                return 'root';
            },
            '/test': () => {
                return 'test';
            }
        });

        const value1 = await router.execute('/');
        expect(value1).toBe('root');

        const value2 = await router.execute('/test');
        expect(value2).toBe('test');

        const value3 = await router.execute('/else').catch(() => 'Not Found');
        expect(value3).toBe('Not Found');
    });

    it('should pick the first route if there are multiple matching routes.', async () => {
        const router = new Router([
            {
                path: '/test',
                handler: () => {
                    return 'a';
                }
            },
            {
                path: '/test',
                handler: () => {
                    return 'b';
                }
            }
        ]);

        const value = await router.execute('/test');
        expect(value).toBe('a');
    });

    it('should receive parameters.', async () => {
        const router = new Router({
            '/users/:userId/comments/:commentId'
                : ({params: {userId, commentId}}) => `${userId} ${commentId}`
        });

        const value = await router.execute('/users/abc/comments/dfg');
        expect(value).toBe('abc dfg');
    });
});
