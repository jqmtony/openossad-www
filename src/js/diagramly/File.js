/**
 * Created by xavi on 30/11/14.
 */

File = function (a, b) {
    mxEventSource.call(this);
    this.ui = a;
    this.data = b || ""
};
mxUtils.extend(File, mxEventSource);
File.prototype.autosaveDelay = 1500;
File.prototype.maxAutosaveDelay = 3E4;
File.prototype.autosaveThread = null;
File.prototype.lastAutosave = null;
File.prototype.modified = !1;
File.prototype.lastAutosaveRevision = null;
File.prototype.maxAutosaveRevisionDelay = 18E5;
File.prototype.descriptorChanged = function () {
    this.fireEvent(new mxEventObject("descriptorChanged"))
};
File.prototype.contentChanged = function () {
    this.fireEvent(new mxEventObject("contentChanged"))
};
File.prototype.save = function (a, b, c) {
    this.setData(this.ui.getFileData());
    this.clearAutosave()
};
File.prototype.saveAs = function (a, b, c) {
};
File.prototype.isModified = function () {
    return this.modified
};
File.prototype.setModified = function (a) {
    this.modified = a
};
File.prototype.isAutosaveOptional = function () {
    return!1
};
File.prototype.isAutosave = function () {
    return this.ui.editor.autosave
};
File.prototype.isRenamable = function () {
    return!1
};
File.prototype.rename = function (a, b, c) {
};
File.prototype.isMovable = function () {
    return!1
};
File.prototype.move = function (a, b, c) {
};
File.prototype.getHash = function () {
    return""
};
File.prototype.getId = function () {
    return""
};
File.prototype.isEditable = function () {
    return!this.ui.editor.chromeless
};
File.prototype.getUi = function () {
    return this.ui
};
File.prototype.getTitle = function () {
    return""
};
File.prototype.setData = function (a) {
    this.data = a
};
File.prototype.getData = function () {
    return this.data
};
File.prototype.open = function () {
    this.ui.setFileData(this.getData());
    this.changeListener = mxUtils.bind(this, function (a, b) {
        this.setModified(!0);
        this.isAutosave() ? (this.ui.editor.setStatus(mxResources.get("saving") + "..."), this.autosave(this.autosaveDelay, this.maxAutosaveDelay, mxUtils.bind(this, function (a) {
            null == this.autosaveThread && this.ui.getCurrentFile() == this && this.ui.editor.setStatus(mxResources.get("allChangesSaved"))
        }), mxUtils.bind(this, function (a) {
            this.ui.getCurrentFile() == this && this.ui.editor.setStatus(mxResources.get("unsavedChanges"))
        }))) :
            this.ui.editor.setStatus(mxResources.get("unsavedChanges"))
    });
    this.ui.editor.graph.model.addListener(mxEvent.CHANGE, this.changeListener);
    this.ui.addListener("pageFormatChanged", this.changeListener);
    this.ui.addListener("backgroundColorChanged", this.changeListener);
    this.ui.addListener("backgroundImageChanged", this.changeListener);
    this.ui.addListener("mathEnabledChanged", this.changeListener);
    this.ui.addListener("gridEnabledChanged", this.changeListener);
    this.ui.addListener("guidesEnabledChanged", this.changeListener);
    this.ui.addListener("pageViewChanged", this.changeListener)
};
File.prototype.autosave = function (a, b, c, d) {
    null == this.lastAutosave && (this.lastAutosave = (new Date).getTime());
    a = (new Date).getTime() - this.lastAutosave < b ? a : 0;
    this.clearAutosave();
    this.autosaveThread = window.setTimeout(mxUtils.bind(this, function () {
        this.lastAutosave = this.autosaveThread = null;
        var a = this.isAutosaveRevision();
        this.save(a, mxUtils.bind(this, function (b) {
            a && (this.lastAutosaveRevision = (new Date).getTime());
            null != c && c(b)
        }), function (a) {
            null != d && d(a)
        })
    }), a)
};
File.prototype.clearAutosave = function () {
    null != this.autosaveThread && (window.clearTimeout(this.autosaveThread), this.autosaveThread = null)
};
File.prototype.close = function () {
    this.isAutosave() && this.isModified() && this.save(this.isAutosaveRevision());
    null != this.changeListener && (this.ui.editor.graph.model.removeListener(this.changeListener), this.ui.removeListener(this.changeListener), this.changeListener = null)
};
File.prototype.isAutosaveRevision = function () {
    var a = (new Date).getTime();
    return null == this.lastAutosaveRevision || a - this.lastAutosaveRevision > this.maxAutosaveRevisionDelay
};