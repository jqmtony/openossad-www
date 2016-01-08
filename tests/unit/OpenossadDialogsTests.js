'use strict';

describe('OpenssadDialogs', function() {

    describe('GraphPropertiesDialog', function() {
        it('should return to base64', function(version) {
            var actual = GraphPropertiesDialog(null);
            expect(actual).toEqual('aGVsbG8gd29ybGRha2FpbmVu');
        });
    });
});