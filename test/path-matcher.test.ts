import {buildMatcher} from '../src/path-matcher';

const match = (pattern:string, path:string) => buildMatcher(pattern)(path);

describe('path matcher', () => {
    describe('match', () => {
        it('should match if the tested path is matched to the pattern', () => {
            expect(match('/','/')).toBeTruthy();
            expect(match('','/')).toBeTruthy();
            expect(match('','')).toBeTruthy();
            expect(match('/','')).toBeTruthy();
            expect(match('/','/extra')).toBeFalsy();
            expect(match('/test','/test')).toBeTruthy();
            expect(match('/test/','/test')).toBeTruthy();
            expect(match('test/','/test')).toBeTruthy();
            expect(match('test','/test')).toBeTruthy();
            expect(match('/test','test')).toBeTruthy();
            expect(match('/test/','test')).toBeTruthy();
            expect(match('test/','test')).toBeTruthy();
            expect(match('test','test')).toBeTruthy();
            expect(match('/test','test/')).toBeTruthy();
            expect(match('/test/','test/')).toBeTruthy();
            expect(match('test/','test/')).toBeTruthy();
            expect(match('test','test/')).toBeTruthy();
            expect(match('/test','/test/')).toBeTruthy();
            expect(match('/test/','/test/')).toBeTruthy();
            expect(match('test/','/test/')).toBeTruthy();
            expect(match('test','/test/')).toBeTruthy();
            expect(match('test','test/y')).toBeFalsy();
        });

        it('should return parameters if the tested path is matched to the pattern with parameters', () => {
            expect(match('/users/:id/name','/users/this-is-id/name')).toMatchObject({params: {id:'this-is-id'}});
            expect(match('/users/:id/name','/users/this-is-id/name2')).toBeFalsy();
            expect(match('/categories/:categoryId/posts/:postId','/categories/my-cat-id/posts/my-post-id')).toMatchObject({params: {categoryId: 'my-cat-id', postId: 'my-post-id'}});
            expect(match('/categories/:categoryId/po----sts/:postId/','/categories/my-cat-id/posts/my-post-id/')).toBeFalsy();
        });

        it('should return parameters if the tested path is matched to the pattern with wildcards', () => {
            expect(match('*','/')).toMatchObject({wildcards: ['']});
            expect(match('/*','/')).toMatchObject({wildcards: ['']});
            expect(match('*/','/')).toMatchObject({wildcards: ['']});
            expect(match('/*/','/')).toMatchObject({wildcards: ['']});
            expect(match('*','')).toMatchObject({wildcards: ['']});
            expect(match('/*','')).toMatchObject({wildcards: ['']});
            expect(match('*/','')).toMatchObject({wildcards: ['']});
            expect(match('/*/','')).toMatchObject({wildcards: ['']});
            expect(match('*/','test/')).toMatchObject({wildcards: ['test']});
            expect(match('*','/')).toMatchObject({wildcards: ['']});
            expect(match('*','/users/name')).toMatchObject({wildcards: ['users/name']});
            expect(match('/*','/users/name')).toMatchObject({wildcards: ['users/name']});
            expect(match('/a*c','/abc')).toMatchObject({wildcards: ['b']});
            expect(match('/users/*','/users')).toMatchObject({wildcards: ['']});
            expect(match('/users/*/','/users')).toMatchObject({wildcards: ['']});
            expect(match('/users/*','/users/')).toMatchObject({wildcards: ['']});
            expect(match('/users/*/','/users/')).toMatchObject({wildcards: ['']});
            expect(match('/users/*','users')).toMatchObject({wildcards: ['']});
            expect(match('/users/*/','users')).toMatchObject({wildcards: ['']});
            expect(match('/users/*','/users/name')).toMatchObject({wildcards: ['name']});
            expect(match('/users/*','/users/name/test')).toMatchObject({wildcards: ['name/test']});
            expect(match('/users/*','/users/name/test/')).toMatchObject({wildcards: ['name/test']});
            expect(match('/users/*/:id','/users/name/my-id')).toMatchObject({wildcards: ['name'], params: {id: 'my-id'}});
            expect(match('/users/*/:id','/users/name/test/my-id')).toMatchObject({wildcards: ['name/test'], params: {id: 'my-id'}});
            expect(match('/users/:id/*','/users/my-id/something/anything')).toMatchObject({wildcards: ['something/anything'], params: {id: 'my-id'}});
        });
    });
});
