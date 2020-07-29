import {Router} from '../src/router';

describe('buildRouter', () => {
    it('should take an route object as an argument of the constructor', () => {
        const router = new Router({
            '/': () => {
                return 'root';
            },
            '/test': () => {
                return 'test';
            }
        });

        const value1 = router.findRoute('/');
        expect(value1).toBe('root');

        const value2 = router.findRoute('/test');
        expect(value2).toBe('test');

        const value3 = router.findRoute('/else');
        expect(value3).toBeNull();
    });

    it('should pick the first route if there are multiple matching routes.', () => {
        const router = new Router({
            '/test' : () => {
                return 'a';
            },
            '/test/' : () => {
                return 'b';
            }
        });

        const value = router.findRoute('/test');
        expect(value).toBe('a');
    });

    it('should receive parameters.', () => {
        const router = new Router({
            '/users/:userId/comments/:commentId'
                : ({params: {userId, commentId}}) => `${userId} ${commentId}`
        });

        const value = router.findRoute('/users/abc/comments/dfg');
        expect(value).toBe('abc dfg');
    });

    it('should receive wildcards.', () => {

        const childRouter = new Router({
            '/comments/:commentId' : ({params: {commentId}}) => {
                return `<span>comment id :${commentId}</span>`;
            }
        });

        const router = new Router({
            '/users/:userId/*' : ({wildcards}) => {
                return '<div>user id: ${userId} and ' + childRouter.findRoute(wildcards[0]) + '</div>';
            }
        });

        const value = router.findRoute('/users/abc/comments/dfg');
        expect(value).toBe('<div>user id: ${userId} and <span>comment id :dfg</span></div>');
    });

    it('should deal with async handlers.', async () => {

        const router = new Router<Promise<string>|string>({
            '/' : async () => 'hey!',
            '/b' : () => 'hey b!',
        });

        expect(router.findRoute('/')).toHaveProperty('then');
        expect(await router.findRoute('/')).toBe('hey!');
        expect(router.findRoute('/b')).toBe('hey b!');
        expect(await router.findRoute('/b')).toBe('hey b!');
    });

    it('should send arguments to callbacks.', async () => {

        const router = new Router({
            '/' : (_, name, size) => {
                return `My name is ${name} and my size is ${size}`;
            }
        });

        expect(router.findRoute('/', 'ippei', '1cm')).toBe('My name is ippei and my size is 1cm');
    });
});
