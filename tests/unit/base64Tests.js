'use strict';

/* jasmine specs for services go here */

describe('base64', function() {

    describe('encode', function() {
        it('should return to base64', function(version) {
            var str = 'hello worldakainen';
            expect(Base64.encode(str, true)).toEqual('aGVsbG8gd29ybGRha2FpbmVu');
        });
    });
    describe('decode', function() {
        it('should return correct string', function(version) {
            var str = 'aGVsbG8gd29ybGRha2FpbmVu';
            expect(Base64.decode(str, true)).toEqual('hello worldakainen');
        });
    });
});