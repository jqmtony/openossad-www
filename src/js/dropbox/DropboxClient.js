/**
 * Created by xavi on 30/11/14.
 */

DropboxClient = function (a) {
    mxEventSource.call(this);
    this.ui = a;
    this.client = new Dropbox.Client({key: this.appKey, sandbox: !0});
    this.client.authDriver(new Dropbox.AuthDriver.Popup({rememberUser: !0, receiverUrl: "https://" + window.location.host + "/dropbox.html"}))
};
mxUtils.extend(DropboxClient, mxEventSource);
DropboxClient.prototype.appKey = "libwls2fa9szdji";
("1" != urlParams.embed && "0" != urlParams.db || "1" == urlParams.embed && "1" == urlParams.db) && isSvgBrowser && document.write('\x3cscript type\x3d"text/javascript" src\x3d"https://www.dropbox.com/static/api/1/dropins.js" id\x3d"dropboxjs" data-app-key\x3d"' + DropboxClient.prototype.appKey + '"\x3e\x3c/script\x3e');
DropboxClient.prototype.appFolder = "/Apps/drawio";
DropboxClient.prototype.extension = ".xml";
DriveClient.prototype.maxRetries = 4;
DropboxClient.prototype.user = null;
DropboxClient.prototype.writingFile = !1;
DropboxClient.prototype.signOut = function () {
    this.client.signOut(mxUtils.bind(this, function () {
        this.setUser(null)
    }))
};
DropboxClient.prototype.setUser = function (a) {
    this.user = a;
    this.fireEvent(new mxEventObject("userChanged"))
};
DropboxClient.prototype.getUser = function () {
    return this.user
};
DropboxClient.prototype.updateUser = function (a, b, c) {
    this.client.getUserInfo(null, mxUtils.bind(this, function (a, b) {
        null == a ? this.setUser(new User(b.uid, b.email, b.name)) : this.setUser(null)
    }))
};
DropboxClient.prototype.execute = function (a) {
    this.client.isAuthenticated() ? a() : this.authorize(!1, mxUtils.bind(this, function (b, c) {
        null != b ? this.ui.handleError(b) : this.client.isAuthenticated() ? (this.updateUser(), a()) : this.ui.showAuthDialog(this, !1, mxUtils.bind(this, function (b, c) {
            this.authorize(!0, mxUtils.bind(this, function (b, d) {
                null != b ? this.ui.handleError(b) : this.client.isAuthenticated() && (this.updateUser(), null != c && c(), a())
            }))
        }))
    }))
};
DropboxClient.prototype.authorize = function (a, b) {
    this.client.authenticate({interactive: a}, mxUtils.bind(this, function (a, d) {
        null != a ? console.log(a) : b()
    }))
};
DropboxClient.prototype.inAppFolder = function (a) {
    var b = a.indexOf(this.appFolder + "/");
    return b == a.indexOf("/", a.indexOf("/view/") + 6) ? decodeURIComponent(a.substring(b + this.appFolder.length + 1)) : null
};
DropboxClient.prototype.getFile = function (a, b, c) {
    var d = mxUtils.bind(this, function () {
        this.execute(mxUtils.bind(this, function () {
            var e = !0, f = window.setTimeout(mxUtils.bind(this, function () {
                e = !1;
                c({code: App.ERROR_TIMEOUT, retry: d})
            }), this.ui.timeout);
            this.client.readFile("/" + a, mxUtils.bind(this, function (a, d, k) {
                window.clearTimeout(f);
                e && (null != a ? c(a) : b(new DropboxFile(this.ui, d, k)))
            }))
        }))
    });
    d()
};
DropboxClient.prototype.checkExists = function (a, b) {
    this.client.stat(a, mxUtils.bind(this, function (c, d) {
        null != c && 404 == c.status || null != d && d.isRemoved ? b(!0) : this.ui.confirm(mxResources.get("replace", [a]), function () {
            b(!0)
        }, function () {
            b(!1)
        })
    }))
};
DropboxClient.prototype.renameFile = function (a, b, c, d) {
    null != a && null != b && this.execute(mxUtils.bind(this, function () {
        this.checkExists(b, mxUtils.bind(this, function (e) {
            e ? this.writeFile(b, a.getData(), mxUtils.bind(this, function (b) {
                this.client.remove(a.getTitle(), function (a, e) {
                    null != a ? d(a) : c(b)
                })
            }), d) : d()
        }))
    }))
};
DropboxClient.prototype.insertFile = function (a, b, c, d) {
    this.execute(mxUtils.bind(this, function () {
        this.checkExists(a, mxUtils.bind(this, function (e) {
            e ? this.writeFile(a, b, mxUtils.bind(this, function (a) {
                c(new DropboxFile(this.ui, b, a))
            }), d) : d()
        }))
    }))
};
DropboxClient.prototype.saveFile = function (a, b, c, d) {
    this.execute(mxUtils.bind(this, function () {
        this.writeFile(a, b, c, d)
    }))
};
DropboxClient.prototype.writeFile = function (a, b, c, d) {
    if (this.writingFile)null != d && d({code: App.ERROR_BUSY}); else {
        var e = !0, f = null;
        this.writingFile = !0;
        var g = 0;
        null != this.requestThread && window.clearTimeout(this.requestThread);
        var l = mxUtils.bind(this, function () {
            null != f && window.clearTimeout(f);
            f = window.setTimeout(mxUtils.bind(this, function () {
                e = this.writingFile = !1;
                d({code: App.ERROR_TIMEOUT, retry: l})
            }), this.ui.timeout);
            this.client.writeFile(a, b, mxUtils.bind(this, function (a, b) {
                window.clearTimeout(f);
                if (e)if (null !=
                    a)if (g < this.maxRetries) {
                    g++;
                    var n = 1 + 0.1 * (Math.random() - 0.5);
                    this.requestThread = window.setTimeout(l, Math.round(1E3 * Math.pow(2, g) * n))
                } else null != d && (this.writingFile = !1, d(a)); else this.writingFile = !1, null != c && c(b)
            }))
        });
        l()
    }
};
DropboxClient.prototype.pickFile = function (a) {
    a = null != a ? a : mxUtils.bind(this, function (a) {
        this.ui.loadFile("D" + encodeURIComponent(a))
    });
    Dropbox.choose({linkType: "direct", cancel: mxUtils.bind(this, function () {
    }), success: mxUtils.bind(this, function (b) {
        this.ui.spinner.spin(document.body, mxResources.get("loading"));
        var c = this.inAppFolder(b[0].link);
        if (null != c)this.ui.spinner.stop(), a(c); else {
            var d = mxUtils.bind(this, function (a) {
                this.ui.handleError(a)
            });
            this.ui.confirm(mxResources.get("note") + ": " + mxResources.get("fileWillBeSavedInAppFolder",
                [b[0].name]), mxUtils.bind(this, function () {
                this.ui.loadUrl(b[0].link, mxUtils.bind(this, function (a) {
                    this.insertFile(b[0].name, a, mxUtils.bind(this, function (a) {
                        this.ui.spinner.stop();
                        this.ui.loadFile(a.getHash())
                    }), d)
                }), d)
            }), d)
        }
    })})
};