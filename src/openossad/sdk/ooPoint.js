/**
 * Created by xavi on 07/12/14.
 */
function ooPoint(a, b) {
    this.x = null != a ? a : 0;
    this.y = null != b ? b : 0
}
ooPoint.prototype.x = null;
ooPoint.prototype.y = null;
ooPoint.prototype.equals = function (a) {
    return null != a && a.x == this.x && a.y == this.y
};