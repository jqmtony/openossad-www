'use strict';

/* jasmine specs for services go here */

describe('Zlib', function() {

    describe('Zlib.RawDeflate', function() {
        describe('compress Array.<number>', function() {
            it('should compress and decompress', function(version) {
                // plain = Array.<number> or Uint8Array
                var text = 'cacahue';
                for (var plain = Array(text.length), c = 0; c < text.length; c++)plain[c] = text.charCodeAt(c);
                var deflate = new Zlib.RawDeflate(text);
                var compressed = deflate.compress();

//                var inflate = new Zlib.Inflate(compressed);
//                var actual = inflate.decompress();
//                console.log(actual);

                var expected = { 0 : 13, 1 : 192, 2 : 129, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 144, 9 : 255, 10 : 107, 11 : 4, length : 12, byteOffset : 0, buffer : { byteLength : 32768 }, byteLength : 12 };
                expect(compressed.buffer).toEqual(expected.buffer);
            });
        });
    });
});