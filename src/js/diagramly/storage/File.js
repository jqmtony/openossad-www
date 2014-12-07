/**
 * Created by xavi on 30/11/14.
 */

File = function (editor, data) {
    mxEventSource.call(this);
    this.ui = editor;
    this.data = data || ""
};
ooUtils.extend(File, mxEventSource);
File.prototype.autosaveDelay = 1500;
File.prototype.maxAutosaveDelay = 3E4;
File.prototype.autosaveThread = null;
File.prototype.lastAutosave = null;
File.prototype.modified = false;
File.prototype.lastAutosaveRevision = null;
File.prototype.maxAutosaveRevisionDelay = 18E5;
File.prototype.descriptorChanged = function () {
    this.fireEvent(new mxEventObject("descriptorChanged"))
};
File.prototype.contentChanged = function () {
    this.fireEvent(new mxEventObject("contentChanged"))
};
File.prototype.save = function (a, b, c) {
    var fileData = this.ui.getFileData();
    this.setData(fileData);
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
    return false;
//    return this.ui.editor.autosave;
};
File.prototype.isRenamable = function () {
    return false;
};
File.prototype.rename = function (a, b, c) {
};
File.prototype.isMovable = function () {
    return false;
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
File.prototype.setData = function (data) {
    this.data = data
};
File.prototype.getData = function () {
    return this.data
};
File.prototype.open = function () {
    this.ui.setFileData(this.getData());

    var onChangeEventAction = function (a, b) {
        this.setModified(true);
    };
    if (this.isAutosave()) {
        this.ui.editor.setStatus(mxResources.get("saving") + "...");
        var b2 = function (a) {
            this.ui.getCurrentFile() == this && this.ui.editor.setStatus(mxResources.get("unsavedChanges"))
        };
        this.autosave(this.autosaveDelay, this.maxAutosaveDelay, mxUtils.bind(this, function (a) {}), mxUtils.bind(this, b2))
    } else {
        this.ui.editor.setStatus(mxResources.get("unsavedChanges"));
    }
    this.changeListener = mxUtils.bind(this, onChangeEventAction);
    this.ui.editor.graph.model.addListener(mxEvent.CHANGE, this.changeListener);
//    this.ui.addListener("pageFormatChanged", this.changeListener);
//    this.ui.addListener("backgroundColorChanged", this.changeListener);
//    this.ui.addListener("backgroundImageChanged", this.changeListener);
//    this.ui.addListener("mathEnabledChanged", this.changeListener);
//    this.ui.addListener("gridEnabledChanged", this.changeListener);
//    this.ui.addListener("guidesEnabledChanged", this.changeListener);
//    this.ui.addListener("pageViewChanged", this.changeListener);
};
File.prototype.autosave = function (autosaveDelay, maxAutosaveDelay, c, d) {
    null == this.lastAutosave && (this.lastAutosave = (new Date).getTime());
    autosaveDelay = (new Date).getTime() - this.lastAutosave < maxAutosaveDelay ? autosaveDelay : 0;
    this.clearAutosave();
    var b2 = function () {
        this.lastAutosave = this.autosaveThread = null;
        var autosaveRevision = this.isAutosaveRevision();
        this.save(autosaveRevision, mxUtils.bind(this, function (b) {
            autosaveRevision && (this.lastAutosaveRevision = (new Date).getTime());
            null != c && c(b)
        }), function (a) {
            null != d && d(a)
        })
    };
    var code = mxUtils.bind(this, b2);
    this.autosaveThread = window.setTimeout(code, autosaveDelay)
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