/**
 * Created by xavi on 07/12/14.
 */
ooRectangle = function ooRectangle(a, b, c, d) {
    ooPoint.call(this, a, b);
    this.width = null != c ? c : 0;
    this.height = null != d ? d : 0
}
ooRectangle.prototype = new ooPoint;
ooRectangle.prototype.constructor = ooRectangle;
ooRectangle.prototype.width = null;
ooRectangle.prototype.height = null;
ooRectangle.prototype.setRect = function (a, b, c, d) {
    this.x = a;
    this.y = b;
    this.width = c;
    this.height = d
};
ooRectangle.prototype.getCenterX = function () {
    return this.x + this.width / 2
};
ooRectangle.prototype.getCenterY = function () {
    return this.y + this.height / 2
};
ooRectangle.prototype.add = function (a) {
    if (null != a) {
        var b = Math.min(this.x, a.x), c = Math.min(this.y, a.y), d = Math.max(this.x + this.width, a.x + a.width);
        a = Math.max(this.y + this.height, a.y + a.height);
        this.x = b;
        this.y = c;
        this.width = d - b;
        this.height = a - c
    }
};
ooRectangle.prototype.grow = function (a) {
    this.x -= a;
    this.y -= a;
    this.width += 2 * a;
    this.height += 2 * a
};
ooRectangle.prototype.getPoint = function () {
    return new mxPoint(this.x, this.y)
};
ooRectangle.prototype.rotate90 = function () {
    var a = (this.width - this.height) / 2;
    this.x += a;
    this.y -= a;
    a = this.width;
    this.width = this.height;
    this.height = a
};
ooRectangle.prototype.equals = function (a) {
    return null != a && a.x == this.x && a.y == this.y && a.width == this.width && a.height == this.height
};
ooRectangle.fromRectangle = function (a) {
    return new ooRectangle(a.x, a.y, a.width, a.height)
};