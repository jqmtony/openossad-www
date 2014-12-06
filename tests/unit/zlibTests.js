'use strict';

/* jasmine specs for services go here */

describe('Zlib', function() {

    describe('Zlib.RawDeflate', function() {
        describe('compress Array.<number>', function() {
            it('should compress and decompress', function(version) {
                // plain = Array.<number> or Uint8Array
                var plain;
                var text = 'cacahue';
                for (var plain = Array(text.length), c = 0; c < text.length; c++)plain[c] = text.charCodeAt(c);
                var deflate = new Zlib.RawDeflate(text);
                var compressed = deflate.compress();

                var inflate = new Zlib.Inflate(compressed);
                var actual = inflate.decompress();
                console.log(actual);
                expect(actual).toEqual('aGVsbG8gd29ybGRha2FpbmVu');
            });
        });
    });
});