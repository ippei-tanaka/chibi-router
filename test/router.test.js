import {buildRouter} from '../src/router';

describe('buildRouter', () => {
    it('should take an route object as an argument of the constructor', () => {
        const router = buildRouter({
            '/': () => {
                return 'root';
            },
            '/test': () => {
                return 'test';
            }
        });

        const value1 = router('/');
        expect(value1).toBe('root');

        const value2 = router('/test');
        expect(value2).toBe('test');

        const value3 = router('/else');
        expect(value3).toBeNull();
    });

    it('should pick the first route if there are multiple matching routes.', () => {
        const router = buildRouter({
            '/test' : () => {
                return 'a';
            },
            '/test/' : () => {
                return 'b';
            }
        });

        const value = router('/test');
        expect(value).toBe('a');
    });

    it('should receive parameters.', () => {
        const router = buildRouter({
            '/users/:userId/comments/:commentId'
                : ({params: {userId, commentId}}) => `${userId} ${commentId}`
        });

        const value = router('/users/abc/comments/dfg');
        expect(value).toBe('abc dfg');
    });

    it('should receive wildcards.', () => {

        const childRouter = buildRouter({
            '/comments/:commentId' : ({params: {commentId}}) => {
                return `<span>comment id :${commentId}</span>`;
            }
        });

        const router = buildRouter({
            '/users/:userId/*' : ({params: {userId}, wildcards}) => {
                return '<div>user id: ${userId} and ' + childRouter(wildcards[0]) + '</div>';
            }
        });

        const value = router('/users/abc/comments/dfg');
        expect(value).toBe('<div>user id: ${userId} and <span>comment id :dfg</span></div>');
    });

    it('should deal with async handlers.', async () => {

        const router = buildRouter({
            '/' : async () => 'hey!',
            '/b' : () => 'hey b!',
        });

        expect(router('/')).toHaveProperty('then');
        expect(await router('/')).toBe('hey!');
        expect(router('/b')).toBe('hey b!');
        expect(await router('/b')).toBe('hey b!');
    });

    it('should send arguments to callbacks.', async () => {

        const router = buildRouter({
            '/' : (_, name, size) => {
                return `My name is ${name} and my size is ${size}`;
            }
        });

        expect(router('/', 'ippei', '1cm')).toBe('My name is ippei and my size is 1cm');
    });
});
