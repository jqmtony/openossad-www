/**
 * Created by xavi on 30/11/14.
 */

DriveClient = function (a) {
    mxEventSource.call(this);
    this.ui = a;
    this.ui.editor.chromeless ? (this.appId = "850530949725", this.clientId = "850530949725.apps.googleusercontent.com", this.scopes = ["https://www.googleapis.com/auth/drive.readonly", "openid"], this.mimeType = "all_types_supported") : this.ui.isDriveDomain() ? (this.appId = "671128082532", this.clientId = "671128082532.apps.googleusercontent.com", this.mimeType = "application/vnd.jgraph.mxfile.realtime") : (this.appId = "420247213240", this.clientId = "420247213240-hnbju1pt13seqrc1hhd5htpotk4g9q7u.apps.googleusercontent.com",
        this.mimeType = "application/vnd.jgraph.mxfile.rtlegacy");
    this.mimeTypes = "application/mxe,application/vnd.jgraph.mxfile,application/mxr,application/vnd.jgraph.mxfile.realtime,application/vnd.jgraph.mxfile.rtlegacy"
};
mxUtils.extend(DriveClient, mxEventSource);
DriveClient.prototype.scopes = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.install", "https://www.googleapis.com/auth/photos", "https://www.googleapis.com/auth/photos.upload", "https://www.googleapis.com/auth/userinfo.profile"];
DriveClient.prototype.libraryMimeType = "application/vnd.jgraph.mxlibrary";
DriveClient.prototype.extension = "";
DriveClient.prototype.tokenRefreshInterval = 0;
DriveClient.prototype.lastTokenRefresh = 0;
DriveClient.prototype.maxRetries = 4;
DriveClient.prototype.mimeTypeCheckCoolOff = 6E4;
DriveClient.prototype.user = null;
DriveClient.prototype.setUser = function (a) {
    this.user = a;
    null == this.user && null != this.tokenRefreshThread && (window.clearTimeout(this.tokenRefreshThread), this.tokenRefreshThread = null);
    this.fireEvent(new mxEventObject("userChanged"))
};
DriveClient.prototype.getUser = function () {
    return this.user
};
DriveClient.prototype.setUserId = function (a, b) {
    if ("undefined" != typeof Storage && (sessionStorage.setItem("GUID", a), b)) {
        var c = new Date;
        c.setYear(c.getFullYear() + 1);
        document.cookie = "GUID\x3d" + a + "; expires\x3d" + c.toUTCString()
    }
};
DriveClient.prototype.clearUserId = function () {
    if ("undefined" != typeof Storage) {
        sessionStorage.removeItem("GUID");
        var a = new Date;
        a.setYear(a.getFullYear() - 1);
        document.cookie = "GUID\x3d; expires\x3d" + a.toUTCString()
    }
};
DriveClient.prototype.getUserId = function () {
    var a = null;
    null != this.user && (a = this.user.id);
    if ("undefined" != typeof Storage && (null == a && (a = sessionStorage.getItem("GUID")), null == a))for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
        var d = mxUtils.trim(b[c]);
        if ("GUID\x3d" == d.substring(0, 5)) {
            a = d.substring(5);
            break
        }
    }
    return a
};
DriveClient.prototype.execute = function (a) {
    var b = mxUtils.bind(this, function (b) {
        this.ui.showAuthDialog(this, !0, mxUtils.bind(this, function (b, c) {
            this.authorize(!1, function () {
                null != c && c();
                a()
            }, mxUtils.bind(this, function () {
                this.ui.drive.clearUserId();
                this.ui.drive.setUser(null);
                gapi.auth.signOut();
                this.ui.showError(mxResources.get("error"), mxResources.get("cannotLogin"), mxResources.get("ok"))
            }), b)
        }))
    });
    this.authorize(!0, a, b)
};
DriveClient.prototype.executeRequest = function (a, b, c) {
    var d = !0, e = null, f = 0;
    null != this.requestThread && window.clearTimeout(this.requestThread);
    var g = mxUtils.bind(this, function () {
        this.requestThread = null;
        this.currentRequest = a;
        null != e && window.clearTimeout(e);
        e = window.setTimeout(mxUtils.bind(this, function () {
            d = false;
            null != c && c({code: App.ERROR_TIMEOUT, retry: g})
        }), this.ui.timeout);
        a.execute(mxUtils.bind(this, function (l) {
            window.clearTimeout(e);
            d && (null != l && null == l.error ? null != b && b(l) : null != l && null != l.error && (401 ==
                l.error.code || 403 == l.error.code) ? this.execute(g) : null != l && null != l.error && 404 != l.error.code && this.currentRequest == a && f < this.maxRetries ? (f++, l = 1 + 0.1 * (Math.random() - 0.5), this.requestThread = window.setTimeout(g, Math.round(1E3 * Math.pow(2, f) * l))) : null != c && c(l))
        }))
    });
    g()
};
DriveClient.prototype.authorize = function (a, b, c, d) {
    var e = this.getUserId();
    if (a && null == e)null != c && c(); else {
        var f = {scope: this.scopes, client_id: this.clientId};
        a && null != e ? (f.immediate = !0, f.user_id = e) : (f.immediate = !1, f.authuser = -1);
        gapi.auth.authorize(f, mxUtils.bind(this, function (f) {
            null != f && null == f.error ? null == this.user || !a || this.user.id != e ? this.updateUser(b, c, d) : null != b && b() : null != c && c();
            this.resetTokenRefresh(f)
        }))
    }
};
DriveClient.prototype.resetTokenRefresh = function (a) {
    null != this.tokenRefreshThread && (window.clearTimeout(this.tokenRefreshThread), this.tokenRefreshThread = null);
    null != a && (null == a.error && 0 < a.expires_in) && (this.tokenRefreshInterval = 1E3 * a.expires_in, this.lastTokenRefresh = (new Date).getTime(), this.tokenRefreshThread = window.setTimeout(mxUtils.bind(this, function () {
        this.authorize(!0, mxUtils.bind(this, function () {
        }), mxUtils.bind(this, function () {
        }))
    }), 900 * a.expires_in))
};
DriveClient.prototype.checkToken = function (a) {
    var b = 0 < this.lastTokenRefresh;
    (new Date).getTime() - this.lastTokenRefresh > this.tokenRefreshInterval || null == this.tokenRefreshThread ? this.execute(mxUtils.bind(this, function () {
        a();
        b && this.fireEvent(new mxEventObject("disconnected"))
    })) : a()
};
DriveClient.prototype.updateUser = function (a, b, c) {
    var d = "https://www.googleapis.com/oauth2/v2/userinfo?alt\x3djson\x26access_token\x3d" + gapi.auth.getToken().access_token;
    this.ui.loadUrl(d, mxUtils.bind(this, function (d) {
        var f = JSON.parse(d);
        this.executeRequest(gapi.client.drive.about.get(), mxUtils.bind(this, function (b) {
            this.setUser(new User(f.id, null, b.user.displayName, null != b.user.picture ? b.user.picture.url : null));
            this.setUserId(f.id, c);
            null != a && a()
        }), b)
    }), b)
};
DriveClient.prototype.copyFile = function (a, b, c, d) {
    null != a && null != b && this.executeRequest(gapi.client.drive.files.copy({fileId: a, resource: {title: b}}), c, d)
};
DriveClient.prototype.renameFile = function (a, b, c, d) {
    null != a && null != b && this.executeRequest(this.createDriveRequest(a, {title: b}), c, d)
};
DriveClient.prototype.moveFile = function (a, b, c, d) {
    null != a && null != b && this.executeRequest(this.createDriveRequest(a, {parents: [
        {kind: "drive#fileLink", id: b}
    ]}), c, d)
};
DriveClient.prototype.createDriveRequest = function (a, b) {
    return gapi.client.request({path: "/drive/v2/files/" + a, method: "PUT", params: {uploadType: "multipart"}, headers: {"Content-Type": "application/json; charset\x3dUTF-8"}, body: JSON.stringify(b)})
};
DriveClient.prototype.getFile = function (a, b, c, d) {
    this.executeRequest(gapi.client.drive.files.get({fileId: a}), mxUtils.bind(this, function (a) {
        d ? this.getXmlFile(a, null, b, c, d) : this.loadRealtime(a, mxUtils.bind(this, function (f) {
            null == f || f.getModel().getRoot().isEmpty() ? this.getXmlFile(a, f, b, c, d) : b(new DriveFile(this.ui, null, a, f))
        }), c)
    }), c)
};
DriveClient.prototype.loadRealtime = function (a, b, c) {
    if ("1" != urlParams.ignoremime && "420247213240" == this.appId && ("application/mxr" == a.mimeType || "application/vnd.jgraph.mxfile.realtime" == a.mimeType))this.redirectToPro(c); else if (a.editable || "application/mxe" != a.mimeType && "application/vnd.jgraph.mxfile" != a.mimeType) {
        var d = mxUtils.bind(this, function () {
            var e = !0, f = window.setTimeout(mxUtils.bind(this, function () {
                e = false;
                c({code: App.ERROR_TIMEOUT, retry: d})
            }), this.ui.timeout);
            gapi.drive.realtime.load(a.id, mxUtils.bind(this,
                function (a) {
                    window.clearTimeout(f);
                    e && b(a)
                }))
        });
        d()
    } else b()
};
DriveClient.prototype.getXmlFile = function (a, b, c, d, e) {
    var f = gapi.auth.getToken().access_token;
    this.ui.loadUrl(a.downloadUrl + "\x26access_token\x3d" + f, mxUtils.bind(this, function (f) {
        if (null == f)d({message: mxResources.get("invalidOrMissingFile")}); else if (a.mimeType == this.libraryMimeType)c(new DriveLibrary(this.ui, f, a)); else {
            var l = new DriveFile(this.ui, f, a, b);
            !e && l.isEditable() && a.mimeType != this.mimeType ? this.saveFile(l, !0, mxUtils.bind(this, function (a) {
                l.desc = a;
                c(l)
            }), d, !0) : c(l)
        }
    }), d)
};
DriveClient.prototype.saveFile = function (a, b, c, d, e) {
    if (a.isEditable()) {
        e = null != e ? e : "www.draw.io" != window.location.hostname || "1" == urlParams.ignoremime;
        var f = mxUtils.bind(this, function () {
            this.executeRequest(this.createUploadRequest(a.getId(), {mimeType: a.desc.mimeType == this.libraryMimeType ? a.desc.mimeType : this.mimeType, title: a.getTitle()}, a.getData(), b || a.desc.mimeType != this.mimeType && a.desc.mimeType != this.libraryMimeType), c, d)
        });
        e || !b ? f() : this.verifyMimeType(a.getId(), f, !0)
    } else null != d && d({message: mxResources.get("readOnly")})
};
DriveClient.prototype.verifyMimeType = function (a, b, c, d) {
    null == this.lastMimeCheck && (this.lastMimeCheck = 0);
    var e = (new Date).getTime();
    if (c || e - this.lastMimeCheck > this.mimeTypeCheckCoolOff)this.lastMimeCheck = e, this.checkingMimeType || (this.checkingMimeType = !0, this.executeRequest(gapi.client.drive.files.get({fileId: a, fields: "mimeType"}), mxUtils.bind(this, function (a) {
        this.checkingMimeType = false;
        null != a && "application/vnd.jgraph.mxfile.realtime" == a.mimeType ? this.redirectToPro(d) : null != b && b()
    })))
};
DriveClient.prototype.redirectToPro = function (a) {
    this.ui.spinner.stop();
    this.redirectDialogShowing || (this.redirectDialogShowing = !0, null != a ? this.ui.confirm(mxResources.get("redirectToPro"), mxUtils.bind(this, function () {
        this.redirectDialogShowing = false;
        window.location.hostname = "drive.openossad.com"
    }), mxUtils.bind(this, function () {
        this.redirectDialogShowing = false;
        a()
    })) : this.ui.alert(mxResources.get("redirectToPro"), mxUtils.bind(this, function () {
        this.redirectDialogShowing = false;
        window.location.hostname = "drive.openossad.com"
    })))
};
DriveClient.prototype.insertFile = function (a, b, c, d, e, f) {
    f = null != f ? f : this.mimeType;
    a = {mimeType: f, title: a};
    null != c && (a.parents = [
        {kind: "drive#fileLink", id: c}
    ]);
    this.executeRequest(this.createUploadRequest(null, a, b, !1), mxUtils.bind(this, function (a) {
        f == this.libraryMimeType ? d(new DriveLibrary(this.ui, b, a)) : this.loadRealtime(a, mxUtils.bind(this, function (c) {
            c = new DriveFile(this.ui, b, a, c);
            c.lastAutosaveRevision = (new Date).getTime();
            d(c)
        }), e)
    }), e)
};
DriveClient.prototype.createUploadRequest = function (a, b, c, d) {
    a = {path: "/upload/drive/v2/files" + (null != a ? "/" + a : ""), method: null != a ? "PUT" : "POST", params: {uploadType: "multipart"}, headers: {"Content-Type": 'multipart/mixed; boundary\x3d"-------314159265358979323846"'}, body: "\r\n---------314159265358979323846\r\nContent-Type: application/json\r\n\r\n" + JSON.stringify(b) + "\r\n---------314159265358979323846\r\nContent-Type: application/octect-stream\r\nContent-Transfer-Encoding: base64\r\n\r\n" + (null != c ? Base64.encode(c) :
        "") + "\r\n---------314159265358979323846--"};
    d || (a.params.newRevision = !1);
    return gapi.client.request(a)
};
DriveClient.prototype.pickFile = function (a, b) {
    this.filePickerCallback = null != a ? a : mxUtils.bind(this, function (a) {
        this.ui.loadFile("G" + a)
    });
    this.filePicked = mxUtils.bind(this, function (a) {
        a.action == google.picker.Action.PICKED && this.filePickerCallback(a.docs[0].id)
    });
    this.ui.spinner.spin(document.body, mxResources.get("authorizing")) && this.checkToken(mxUtils.bind(this, function () {
        this.ui.spinner.stop();
        var a = gapi.auth.getToken().access_token, d = b ? "genericPicker" : "filePicker";
        if (null == this[d] || this[d + "Token"] !=
            a)this[d + "Token"] = a, a = new google.picker.DocsView, b || a.setMimeTypes(this.mimeTypes), this[d] = (new google.picker.PickerBuilder).enableFeature(google.picker.Feature.NAV_HIDDEN).setOAuthToken(this[d + "Token"]).setLocale(mxLanguage).setAppId(this.appId).addView(a).setCallback(mxUtils.bind(this, function (a) {
            a.action == google.picker.Action.PICKED && this.filePicked(a)
        })).build();
        this[d].setVisible(true);
        this.ui.movePickersToTop()
    }))
};
DriveClient.prototype.pickLibrary = function (a) {
    this.filePickerCallback = null != a ? a : mxUtils.bind(this, function (a) {
        this.ui.loadFile("G" + a)
    });
    this.filePicked = mxUtils.bind(this, function (a) {
        a.action == google.picker.Action.PICKED ? this.filePickerCallback(a.docs[0].id) : a.action == google.picker.Action.CANCEL && null == this.ui.getCurrentFile() && this.ui.showSplash()
    });
    this.ui.spinner.spin(document.body, mxResources.get("authorizing")) && this.checkToken(mxUtils.bind(this, function () {
        this.ui.spinner.stop();
        var a = gapi.auth.getToken().access_token;
        if (null == this.libraryPicker || this.libraryPickerToken != a)this.libraryPickerToken = a, a = new google.picker.DocsView, a.setMimeTypes(this.libraryMimeType), this.libraryPicker = (new google.picker.PickerBuilder).enableFeature(google.picker.Feature.NAV_HIDDEN).setOAuthToken(this.libraryPickerToken).setLocale(mxLanguage).setAppId(this.appId).addView(a).setCallback(mxUtils.bind(this, function (a) {
            a.action == google.picker.Action.PICKED && this.filePicked(a)
        })).build();
        this.libraryPicker.setVisible(true);
        this.ui.movePickersToTop()
    }))
};
DriveClient.prototype.showPermissions = function (a) {
    var b = new gapi.drive.share.ShareClient(this.appId);
    b.setItemIds([a]);
    b.showSettingsDialog()
};