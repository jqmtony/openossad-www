/**
 * Created by xavi on 06/12/14.
 */

EditorCompress = function(graph){
    this.graph = graph || new OpenossadGraph();
}

EditorCompress.prototype.stringToBytes = function (a) {
    for (var b = Array(a.length), c = 0; c < a.length; c++)b[c] = a.charCodeAt(c);
    return b
};
EditorCompress.prototype.bytesToString = function (a) {
    for (var b = "", c = 0; c < a.length; c++)b += String.fromCharCode(a[c]);
    return b
};
EditorCompress.prototype.compress = function (a) {
    if ("undefined" === typeof Zlib)return Base64.encode(encodeURIComponent(a), true);
    a = encodeURIComponent(a);
//    a = new Zlib.RawDeflate(this.stringToBytes(a));
//    a = a.compress();
    return window.btoa ? btoa(a) : Base64.encode(a, true);
};
EditorCompress.prototype.decompress = function (a) {
    if ("undefined" === typeof Zlib)return Base64.decode(decodeURIComponent(a), true);
    a = window.atob ? atob(a) : Base64.decode(a, true);
    a = decodeURIComponent(a);
//    a = new Zlib.RawInflate(decodeURIComponent(a));
//    a = a.decompress();
    return this.graph.zapGremlins(a);
};