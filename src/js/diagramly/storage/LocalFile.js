/**
 * Created by xavi on 06/12/14.
 */

LocalFile = function (a, b, c) {
    File.call(this, a, b);
    this.title = c
};
ooUtils.extend(LocalFile, File);
LocalFile.prototype.isAutosave = function () {
    return false
};
LocalFile.prototype.getMode = function () {
    return App.MODE_DEVICE
};
LocalFile.prototype.getTitle = function () {
    return this.title
};
LocalFile.prototype.isRenamable = function () {
    return true
};
LocalFile.prototype.save = function (a, b, c) {
    this.saveAs(this.title, b, c)
};
LocalFile.prototype.saveAs = function (a, b, c) {
    File.prototype.save.apply(this, arguments);
    var d = this.getData();
    this.title = a;
    this.ui.isOfflineApp() ? this.ui.saveLocalFile(d, this.title, "text/xml") : d.length < MAX_REQUEST_SIZE ? (new mxXmlRequest(SAVE_URL, "format\x3dxml\x26filename\x3d" + encodeURIComponent(a) + "\x26xml\x3d" + encodeURIComponent(d))).simulate(document, "_blank") : (ooUtils.alert(mxResources.get("drawingTooLarge")), ooUtils.popup(d));
    this.contentChanged();
    null != b && b()
};
LocalFile.prototype.rename = function (a, b, c) {
    this.title = a;
    this.descriptorChanged();
    null != b && b()
};
LocalFile.prototype.open = function () {
    this.ui.setFileData(this.getData());
    this.changeListener = ooUtils.bind(this, function (a, b) {
        this.ui.editor.setStatus(mxResources.get("unsavedChanges"));
        this.setModified(true)
    });
//    this.ui.editor.graph.model.addListener(mxEvent.CHANGE, this.changeListener)
};