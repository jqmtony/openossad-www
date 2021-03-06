/**
 * Created by xavi on 30/11/14.
 */

StorageFile = function (editor, data, title) {
    File.call(this, editor, data);
    this.title = title
};
ooUtils.extend(StorageFile, File);
StorageFile.prototype.autosaveDelay = 500;
StorageFile.prototype.maxAutosaveDelay = 1E4;
StorageFile.prototype.getMode = function () {
    return App.MODE_BROWSER
};
StorageFile.prototype.isAutosaveOptional = function () {
    return!0
};
StorageFile.prototype.getHash = function () {
    return"L" + encodeURIComponent(this.getTitle())
};
StorageFile.prototype.getTitle = function () {
    return this.title
};
StorageFile.prototype.isRenamable = function () {
    return!0
};
StorageFile.prototype.save = function (a, b, c) {
    this.saveAs(this.getTitle(), b, c)
};
StorageFile.prototype.saveAs = function (title, b, c) {
    File.prototype.save.apply(this, arguments);
    this.doSave(title, b, c)
};
StorageFile.prototype.doSave = function (title, b, c) {
    var data = this.getData();

    var e = ooUtils.bind(this, function () {
        this.title = title;
        localStorage.setItem(this.title, data);
        this.setModified(false);
        this.contentChanged();
        null != b && b()
    });
    this.getTitle() == title || null == localStorage.getItem(title) ? e() : this.ui.confirm(mxResources.get("replace", [title]), e, c)
};
StorageFile.prototype.rename = function (a, b, c) {
    var d = this.getTitle();
    this.doSave(a, function () {
        d != a && localStorage.removeItem(d);
        b()
    }, c)
};
StorageFile.prototype.open = function () {
    File.prototype.open.apply(this, arguments);
//    this.doSave(this.getTitle())
};