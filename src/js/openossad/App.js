/**
 * Created by xavi on 30/11/14.
 */

App = function (a) {
    EditorUi.call(this, a);
    (new Image).src = mxGraph.prototype.warningImage.src;
    window.openWindow = ooUtils.bind(this, function (a, c, d) {
        var e = window.open(a);
        null == e || void 0 === e ? this.showDialog((new PopupDialog(this, a, c, d)).container, 320, 140, !0, !0) : null != c && c()
    });
    window.showOpenAlert = ooUtils.bind(this, function (a) {
        this.handleError(a)
    });
    this.load()
};
ooUtils.extend(App, EditorUi);
App.prototype.alertUrl = "1" == urlParams.dev ? "drawio-alert.html" : "https://www.openossad.com/drawio-alert.html";
App.prototype.defaultUserPicture = "https://lh3.googleusercontent.com/-HIzvXUy6QUY/AAAAAAAAAAI/AAAAAAAAAAA/giuR7PQyjEk/photo.jpg?sz\x3d30";
App.prototype.mode = null;
App.prototype.timeout = 25E3;
App.ERROR_TIMEOUT = "timeout";
App.ERROR_BUSY = "busy";
App.ERROR_UNKNOWN = "unknown";
App.MODE_GOOGLE = "google";
App.MODE_DROPBOX = "dropbox";
App.MODE_DEVICE = "device";
App.MODE_BROWSER = "browser";
"1" != urlParams.embed && (App.prototype.menubarHeight = 60);
App.prototype.init = function () {
    EditorUi.prototype.init.apply(this, arguments);
    this.defaultFilename = mxResources.get("untitledDiagram");
    this.defaultLibraryName = mxResources.get("untitledLibrary");
    this.descriptorChangedListener = ooUtils.bind(this, this.descriptorChanged);
    "1" != urlParams.embed && (this.bg = this.createBackground(), document.body.appendChild(this.bg), this.diagramContainer.style.visibility = "hidden", "undefined" != typeof gapi && (this.drive = new DriveClient(this), this.drive.addListener("userChanged", ooUtils.bind(this,
        function () {
            var a = this.getCurrentFile();
            if (null == this.drive.getUser() && (null == a || a.constructor == DriveFile))this.setMode(null), this.fileLoaded(null);
            a = document.getElementById("gePowered");
            null != a && (a.innerHTML = null != this.drive && "420247213240" == this.drive.appId ? '\x3ca title\x3d"IMPORTANT NOTICE" href\x3d"https://support.openossad.com/display/DO/2014/11/27/Switching+application+in+Google+Drive" target\x3d"_blank" style\x3d"text-decoration:none;"\x3eIMPORTANT NOTICE\x3c/a\x3e' : '\x3ca title\x3d"Please rate us" href\x3d"https://chrome.google.com/webstore/detail/drawio-pro/onlkggianjhjenigcpigpjehhpplldkc/reviews" target\x3d"_blank" style\x3d"text-decoration:none;"\x3ePlease help us to 5 stars\x3c/a\x3e');
            a = document.getElementById("gePlug1");
            null != a && null != this.drive && "420247213240" == this.drive.appId && (a.innerHTML = '\x3ca title\x3d"IMPORTANT NOTICE" href\x3d"https://support.openossad.com/display/DO/2014/11/27/Switching+application+in+Google+Drive" target\x3d"_blank" style\x3d"text-decoration:none;"\x3eIMPORTANT NOTICE\x3c/a\x3e');
            this.updateUserElement()
        }))), "undefined" != typeof Dropbox && null != Dropbox.Client && (this.dropbox = new DropboxClient(this), this.dropbox.addListener("userChanged", ooUtils.bind(this, function () {
        var a =
            this.getCurrentFile();
        null == this.dropbox.getUser() && (null == a || a.constructor == DropboxFile) && this.fileLoaded(null);
        this.updateUserElement()
    }))), this.updateHeader(), null == this.drive && null == this.dropbox && useLocalStorage && "device" != urlParams.storage ? this.setMode(App.MODE_BROWSER) : (this.mode = urlParams.mode, null == this.mode && this.setMode(this.getStoredMode() || this.getPreferredMode())));
    "atlas" == uiTheme && (null != this.toggleElement && (this.toggleElement.click(), this.toggleElement.style.display = "none"), this.icon =
        document.createElement("img"), this.icon.setAttribute("src", IMAGE_PATH + "/logo-flat-small.png"), this.icon.setAttribute("title", mxResources.get("draw.io")), this.icon.style.paddingTop = "12px", this.icon.style.marginLeft = "4px", this.icon.style.marginRight = "6px", mxClient.IS_QUIRKS && (this.icon.style.marginTop = "12px"), this.menubar.container.insertBefore(this.icon, this.menubar.container.firstChild))
};
App.prototype.isOfflineApp = function () {
    return"1" == urlParams.offline
};
App.prototype.isOffline = function () {
    return mxClient.IS_FF && this.isOfflineApp() || !navigator.onLine
};
App.prototype.isDriveDomain = function () {
    return"rt.openossad.com" == window.location.hostname || "drive.openossad.com" == window.location.hostname
};
App.prototype.getPreferredMode = function () {
    return this.isDriveDomain() ? App.MODE_GOOGLE : null
};
EditorUi.prototype.onBeforeUnload = function () {
    var a = this.getCurrentFile();
    if (null != a) {
        if (a.constructor == LocalFile && a.isModified())return mxResources.get("ensureDataSaved");
        if ((a.constructor == DropboxFile || !a.isAutosave()) && a.isModified())return mxResources.get("allChangesLost");
        a.close()
    }
};
App.prototype.updateDocumentTitle = function () {
    var a = this.editor.appName, b = this.getCurrentFile();
    null != b && (a = (null != b.getTitle() ? b.getTitle() : this.defaultFilename) + " - " + a);
    this.isOfflineApp() && (a += " [" + mxResources.get("offline") + "]");
    document.title = a
};
App.prototype.getFileData = function () {
    var graphXml = this.editor.getGraphXml();
    var diagramElement = graphXml.ownerDocument.createElement("diagram");
    var mxfile = graphXml.ownerDocument.createElement("mxfile");
    mxfile.setAttribute("userAgent", navigator.userAgent);
    mxfile.setAttribute("type", this.mode);
    var a = this.editor.graph.zapGremlins(ooUtils.getXml(graphXml));
    var text = this.editor.compress(a);
    if (this.editor.decompress(text) != a) {
        try {
            this.errorReported || (this.errorReported = true, ooUtils.post("/email", "data\x3d" + encodeURIComponent("Diagram:\n" + encodeURIComponent(a) + "\nBrowser:\n" + navigator.userAgent)))
        } catch (e) {
        }
        return a
    }
    ooUtils.setTextContent(diagramElement,text);

    mxfile.appendChild(diagramElement);
    var xml = ooUtils.getXml(mxfile);
    return  xml;
};

App.prototype.setFileData = function (data) {
    if (data && 0 < data.length) {
        data = ooUtils.parseXml(data).documentElement;
        this.editor.setGraphXml(data);
    } else {
        this.editor.resetGraph();
        this.editor.graph.model.clear();
        this.editor.fireEvent(new mxEventObject("resetGraphView"));
    }
};
App.prototype.createBackground = function () {
    var a = this.createDiv("background");
    a.style.position = "absolute";
    a.style.background = "white";
    a.style.left = "0px";
    a.style.top = "0px";
    a.style.bottom = "0px";
    a.style.right = "0px";
    ooUtils.setOpacity(a, 100);
    mxClient.IS_QUIRKS && new mxDivResizer(a);
    return a
};
App.prototype.setMode = function (a, b) {
    this.mode = a;
    null != this.mode && (useLocalStorage = this.mode == App.MODE_BROWSER);
    if ("undefined" != typeof Storage && b) {
        var c = new Date;
        c.setYear(c.getFullYear() + 1);
        document.cookie = "MODE\x3d" + a + "; expires\x3d" + c.toUTCString()
    }
    null != this.appIcon && (this.mode == App.MODE_GOOGLE ? (this.appIcon.setAttribute("href", "https://drive.google.com/?authuser\x3d0"), this.appIcon.setAttribute("title", mxResources.get("openIt", [mxResources.get("googleDrive")])), this.appIcon.setAttribute("target",
        "_blank"), this.appIcon.style.cursor = "pointer") : this.mode == App.MODE_DROPBOX ? (this.appIcon.setAttribute("href", "https://www.dropbox.com/"), this.appIcon.setAttribute("title", mxResources.get("openIt", [mxResources.get("dropbox")])), this.appIcon.setAttribute("target", "_blank"), this.appIcon.style.cursor = "pointer") : (this.appIcon.setAttribute("href", "javascript:void(0);"), this.appIcon.removeAttribute("title"), this.appIcon.removeAttribute("target"), this.appIcon.style.cursor = "default"))
};
App.prototype.clearMode = function () {
    if ("undefined" != typeof Storage) {
        var a = new Date;
        a.setYear(a.getFullYear() - 1);
        document.cookie = "MODE\x3d; expires\x3d" + a.toUTCString()
    }
};
App.prototype.getStoredMode = function () {
    var a = null;
    if ("undefined" != typeof Storage)for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
        var d = ooUtils.trim(b[c]);
        if ("MODE\x3d" == d.substring(0, 5)) {
            a = d.substring(5);
            break
        }
    }
    return a
};
App.prototype.createSpinner = function (a, b, c) {
    c = null != c ? c : 24;
    var spinner = new Spinner({lines: 12, length: c, width: Math.round(c / 3), radius: Math.round(c / 2), rotate: 0, color: "#000", speed: 1.5, trail: 60, shadow: !1, hwaccel: !1, zIndex: 2E9});
    var spin = spinner.spin;
    spinner.spin = function (c, f) {
        var spinDiv = false;
        if (!this.active) {
            spin.call(this, c);
            this.active = true;
            if (null != f) {
                    spinDiv = document.createElement("div");
                    spinDiv.style.position = "absolute";
                    spinDiv.style.whiteSpace = "nowrap";
                    spinDiv.style.background = "#4B4243";
                    spinDiv.style.color = "white";
                    spinDiv.style.fontFamily = "Helvetica, Arial";
                    spinDiv.style.fontSize = "9pt";
                    spinDiv.style.padding = "6px";
                    spinDiv.style.paddingLeft = "10px";
                    spinDiv.style.paddingRight = "10px";
                    spinDiv.style.zIndex = 2E9;
                    spinDiv.style.left = Math.max(0, a) + "px";
                    spinDiv.style.top = Math.max(0, b + 70) + "px";
//                    ooUtils.setPrefixedStyle(spinDiv.style, "borderRadius", "6px");
//                    ooUtils.setPrefixedStyle(spinDiv.style, "boxShadow", "2px 2px 3px 0px #ddd");
//                    ooUtils.setPrefixedStyle(spinDiv.style, "transform", "translate(-50%,-50%)");
                    spinDiv.innerHTML = f + "...";
                    c.appendChild(spinDiv);
                    spinner.status = spinDiv;
                    if (mxClient.IS_VML && (null == document.documentMode || 8 >= document.documentMode)) {
                        spinDiv.style.left = Math.round(Math.max(0,a - spinDiv.offsetWidth / 2)) + "px",
                        spinDiv.style.top = Math.round(Math.max(0, b + 70 - spinDiv.offsetHeight / 2)) + "px";
                    }
            }
            this.pause = ooUtils.bind(this, function () {
                var a = function () { };
                this.active && (a = ooUtils.bind(this, function () {
                    this.spin(c, f)
                }));
                this.stop();
                return a
            });
            spinDiv = true;
        }
        return spinDiv
    };
    var f = spinner.stop;
    spinner.stop = function () {
        f.call(this);
        this.active = false;
        null != spinner.status && (spinner.status.parentNode.removeChild(spinner.status), spinner.status = null)
    };
    return spinner
};
App.prototype.getDiagramId = function () {
    var a = window.location.hash;
    null != a && 0 < a.length && (a = a.substring(1));
    return a
};
App.prototype.getSearch = function (a) {
    var b = "";
    if ("1" != urlParams.offline && "1" != urlParams.demo && null != a && 0 < window.location.search.length) {
        var c = "?", d;
        for (d in urlParams)0 > ooUtils.indexOf(a, d) && null != urlParams[d] && (b += c + d + "\x3d" + urlParams[d], c = "\x26")
    } else b = window.location.search;
    return b
};
App.prototype.open = function () {
    try {
        if (null != window.opener) {
            var a = urlParams.create;
            null != a && (a = decodeURIComponent(a));
            if (null != a && 0 < a.length && "http://" != a.substring(0, 7) && "https://" != a.substring(0, 8)) {
                var b = ooUtils.parseXml(window.opener[a]);
                this.editor.setGraphXml(b.documentElement)
            } else null != window.opener.openFile && window.opener.openFile.setConsumer(ooUtils.bind(this, function (a, b) {
                this.fileLoaded(this.mode == App.MODE_BROWSER ? new StorageFile(this, a, b) : new LocalFile(this, a, b))
            }))
        }
    } catch (c) {
    }
};
App.prototype.load = function () {

    var spin = this.spinner.spin(document.body, mxResources.get("starting"));
//    "1" != urlParams.embed  && spin && (this.stateArg = null != urlParams.state && null != this.drive ? JSON.parse(decodeURIComponent(urlParams.state)) : null, this.editor.graph.setEnabled(null != this.getCurrentFile()), "undefined" != typeof Storage && null != this.stateArg && null != this.stateArg.userId && this.drive.setUserId(this.stateArg.userId), null != this.stateArg && "open" == this.stateArg.action ? (window.location.hash = "G" + this.stateArg.ids[0], window.location.search =
//        this.getSearch(["state"])) : null != urlParams.fileId ? (window.location.hash = "G" + urlParams.fileId, window.location.search = this.getSearch(["fileId"])) : null == this.drive ? this.start() : gapi.load("auth:client,drive-realtime,drive-share",
//        ooUtils.bind(this, function () {
//        gapi.client.load("drive", "v2", ooUtils.bind(this, function () { gapi.auth.init(ooUtils.bind(this, function ()
//        {
//                this.start()
//        }))
//        }))
//    })))
    this.start();
};
App.prototype.showRemoteAlert = function () {
    if (isLocalStorage && !this.isOffline())try {
        this.loadUrl(this.alertUrl, function (a) {
            if (null != a && (a = ooUtils.trim(a), 0 < a.length && mxSettings.getLastAlert() != a)) {
                mxSettings.setLastAlert(a);
                mxSettings.save();
                var c = document.createElement("div");
                c.className = "geAlert";
                c.style.zIndex = 2E9;
                c.style.left = "50%";
                c.style.top = "-100%";
                ooUtils.setPrefixedStyle(c.style, "transform", "translate(-50%,0%)");
                ooUtils.setPrefixedStyle(c.style, "transition", "all 1s ease");
                c.innerHTML = a;
                a = document.createElement("a");
                a.className = "geAlertLink";
                a.style.textAlign = "right";
                a.style.marginTop = "20px";
                a.style.display = "block";
                a.setAttribute("href", "javascript:void(0);");
                a.setAttribute("title", mxResources.get("close"));
                a.innerHTML = mxResources.get("close");
                c.appendChild(a);
                mxEvent.addListener(a, "click", function (a) {
                    null != c.parentNode && (c.parentNode.removeChild(c), mxEvent.consume(a))
                });
                document.body.appendChild(c);
                window.setTimeout(function () {
                    c.style.top = "30px"
                }, 10);
                window.setTimeout(function () {
                    ooUtils.setPrefixedStyle(c.style,
                        "transition", "all 2s ease");
                    c.style.opacity = "0";
                    window.setTimeout(function () {
                        null != c.parentNode && c.parentNode.removeChild(c)
                    }, 2E3)
                }, 15E3)
            }
        })
    } catch (a) {
    }
};
App.prototype.start = function () {
    this.bg.parentNode.removeChild(this.bg);
    this.spinner.stop();
    this.showRemoteAlert();
    if (null != urlParams.url && this.spinner.spin(document.body, mxResources.get("loading"))) {
        var a = ooUtils.bind(this, function () {
            this.spinner.spin(document.body, mxResources.get("reconnecting")) && (window.location.search = this.getSearch(["url"]))
        });

        ooUtils.get(PROXY_URL + "?url\x3d" + urlParams.url, ooUtils.bind(this, function (b) {
            200 == b.getStatus() ? (this.spinner.stop(), this.fileLoaded(new LocalFile(this,b.getText(), null))) : this.handleError(null, mxResources.get("errorLoadingFile"), a)
        }), ooUtils.bind(this, function () {
            this.handleError(null, mxResources.get("errorLoadingFile"), a)
        }))
    } else if (null == this.getCurrentFile()) {
        var b = ooUtils.bind(this, function () {
            "1" == urlParams.client ? (window.opener || window.parent) != window && this.installMessageHandler(ooUtils.bind(this, function (a) {
                this.fileLoaded(new LocalFile(this, a, urlParams.title || this.defaultFilename));
                this.getCurrentFile().setModified(true)
            })) : null == this.dialog &&
                ("1" == urlParams.demo ? this.createFile(this.defaultFilename, null, null, useLocalStorage ? App.MODE_BROWSER : App.MODE_DEVICE) : this.loadFile(this.getDiagramId()))
        }), c = urlParams.create;
        if (null != c && 0 < c.length && this.spinner.spin(document.body, mxResources.get("loading"))) {
            var a = ooUtils.bind(this, function () {
                this.spinner.spin(document.body, mxResources.get("reconnecting")) && (window.location.search = this.getSearch(["create", "title"]))
            }), d = ooUtils.bind(this, function (a) {
                this.spinner.stop();
                this.fileLoaded(new LocalFile(this,
                    a, null));
                this.editor.graph.setEnabled(false);
                this.mode = urlParams.mode;
                var b = urlParams.title, b = null != b ? decodeURIComponent(b) : this.defaultFilename, b = new CreateDialog(this, b, ooUtils.bind(this, function (b, c) {
                    this.createFile(b, a, null, c)
                }));
                this.showDialog(b.container, 320, 180, !0, !1, ooUtils.bind(this, function (a) {
                    a && null == this.getCurrentFile() && this.showSplash()
                }));
                b.init()
            }), c = decodeURIComponent(c);
            if ("http://" != c.substring(0, 7) && "https://" != c.substring(0, 8))try {
                null != window.opener && null != window.opener[c] ? d(window.opener[c]) :
                    this.handleError(null, mxResources.get("errorLoadingFile"))
            } catch (e) {
                this.handleError(e, mxResources.get("errorLoadingFile"))
            } else ooUtils.get(PROXY_URL + "?url\x3d" + c, ooUtils.bind(this, function (b) {
                200 == b.getStatus() ? d(b.getText()) : this.handleError(null, mxResources.get("errorLoadingFile"), a)
            }), ooUtils.bind(this, function () {
                this.handleError(null, mxResources.get("errorLoadingFile"), a)
            }))
        } else null != this.drive && null != this.stateArg && "create" == this.stateArg.action ? (this.setMode(App.MODE_GOOGLE), this.actions.get("new").funct()) :
            (null != this.drive && this.defineCustomObjects(), mxEvent.addListener(window, "hashchange", ooUtils.bind(this, function (a) {
                a = this.getDiagramId();
                var b = this.getCurrentFile();
                (null == b || b.getHash() != a) && this.loadFile(a, !0)
            })), b())
    }
};
App.prototype.showSplash = function (a) {
    this.editor.chromeless ? this.handleError({message: mxResources.get("noFileSelected")}, mxResources.get("errorLoadingFile"), ooUtils.bind(this, function () {
        this.showSplash()
    })) : null == this.mode || a ? this.showDialog((new StorageDialog(this, ooUtils.bind(this, function () {
        this.hideDialog();
        this.showDialog((new SplashDialog(this)).container, 340, 260, !0, !0)
    }))).container, isLocalStorage ? 380 : 320, 260, !0, !1) : this.showDialog((new SplashDialog(this)).container, 340, 260, !0, !0)
};
App.prototype.addLanguageMenu = function (a) {
    if (!this.isOfflineApp() && null != this.menus.get("language")) {
        var b = document.createElement("div");
        b.setAttribute("title", mxResources.get("language"));
        b.className = "geIcon geSprite geSprite-globe";
        b.style.position = "absolute";
        b.style.cursor = "pointer";
        b.style.bottom = "20px";
        b.style.right = "20px";
        mxEvent.addListener(b, "click", ooUtils.bind(this, function (a) {
            this.editor.graph.popupMenuHandler.hideMenu();
            var d = new mxPopupMenu(this.menus.get("language").funct);
            d.div.className +=
                " geMenubarMenu";
            d.smartSeparators = true;
            d.showDisabled = true;
            d.autoExpand = true;
            d.hideMenu = ooUtils.bind(this, function () {
                mxPopupMenu.prototype.hideMenu.apply(d, arguments);
                d.destroy()
            });
            var e = ooUtils.getOffset(b);
            d.popup(e.x, e.y + b.offsetHeight, null, a);
            this.menubar.currentMenu = d
        }));
        a.appendChild(b)
    }
};
App.prototype.defineCustomObjects = function () {
//    null != gapi.drive.realtime && null != gapi.drive.realtime.custom && (gapi.drive.realtime.custom.registerType(mxRtCell, "Cell"), mxRtCell.prototype.cellId = gapi.drive.realtime.custom.collaborativeField("cellId"), mxRtCell.prototype.type = gapi.drive.realtime.custom.collaborativeField("type"), mxRtCell.prototype.value = gapi.drive.realtime.custom.collaborativeField("value"), mxRtCell.prototype.xmlValue = gapi.drive.realtime.custom.collaborativeField("xmlValue"), mxRtCell.prototype.style =
//        gapi.drive.realtime.custom.collaborativeField("style"), mxRtCell.prototype.geometry = gapi.drive.realtime.custom.collaborativeField("geometry"), mxRtCell.prototype.visible = gapi.drive.realtime.custom.collaborativeField("visible"), mxRtCell.prototype.collapsed = gapi.drive.realtime.custom.collaborativeField("collapsed"), mxRtCell.prototype.connectable = gapi.drive.realtime.custom.collaborativeField("connectable"), mxRtCell.prototype.parent = gapi.drive.realtime.custom.collaborativeField("parent"), mxRtCell.prototype.children =
//        gapi.drive.realtime.custom.collaborativeField("children"), mxRtCell.prototype.source = gapi.drive.realtime.custom.collaborativeField("source"), mxRtCell.prototype.target = gapi.drive.realtime.custom.collaborativeField("target"))
};
mxRtCell = function () {
};
mxCodecRegistry.getCodec(mxCell).exclude.push("rtCell");
mxCell.prototype.mxTransient.push("rtCell");
App.prototype.pickFile = function (a) {
    a = null != a ? a : this.mode;
    if (a == App.MODE_DROPBOX)null != this.dropbox && this.dropbox.pickFile(); else if (a == App.MODE_GOOGLE)null != this.drive && "undefined" != typeof google && "undefined" != typeof google.picker ? this.drive.pickFile() : window.open("https://drive.google.com"); else {
        window.openNew = null != this.getCurrentFile();
        window.baseUrl = this.getUrl();
        window.openKey = "open";
        var b = useLocalStorage;
        useLocalStorage = a == App.MODE_BROWSER;
        this.openFile();
        window.openFile.setConsumer(ooUtils.bind(this,
            function (b, c) {
                this.fileLoaded(a == App.MODE_BROWSER ? new StorageFile(this, b, c) : new LocalFile(this, b, c))
            }));
        var c = this.dialog, d = c.close;
        this.dialog.close = ooUtils.bind(this, function (a) {
            useLocalStorage = b;
            d.apply(c, arguments)
        })
    }
};
App.prototype.pickLibrary = function (a) {
    this.drive.pickLibrary(ooUtils.bind(this, function (a) {
        this.spinner.spin(document.body, mxResources.get("loading")) && this.drive.getFile(a, ooUtils.bind(this, function (a) {
            this.spinner.stop();
            try {
                this.loadLibrary(a)
            } catch (b) {
                this.handleError(b, mxResources.get("errorLoadingFile"))
            }
        }), ooUtils.bind(this, function (a) {
            this.handleError(a, null != a ? mxResources.get("errorLoadingFile") : null)
        }))
    }))
};
App.prototype.saveLibrary = function (a, b, c) {
    var d = ooUtils.createXmlDocument(), e = d.createElement("mxlibrary");
    e.setAttribute("type", "images");
    ooUtils.setTextContent(e, JSON.stringify(b));
    d.appendChild(e);
    var d = ooUtils.getXml(d), f = ooUtils.bind(this, function (a) {
        this.spinner.stop();
        this.handleError(a, null != a ? mxResources.get("errorSavingFile") : null)
    });
    null == c && this.spinner.spin(document.body, mxResources.get("inserting")) ? this.drive.insertFile(a, d, null, ooUtils.bind(this, function (a) {
        this.spinner.stop();
        this.hideDialog(true);
        this.libraryLoaded(a, b)
    }), f, this.drive.libraryMimeType) : this.spinner.spin(document.body, mxResources.get("saving")) && (c.setData(d), c.save(!0, ooUtils.bind(this, function (e) {
        a == c.getTitle() ? (this.spinner.stop(), this.hideDialog(true), this.libraryLoaded(c, b)) : c.rename(a, function (a) {
            this.spinner.stop();
            this.hideDialog(true);
            this.libraryLoaded(c, b)
        }, f)
    }), f))
};
App.prototype.saveFile = function (title) {
    var currentFile = this.getCurrentFile();
    var arg = function (a) {
        this.save(a, true)
    };

    var arg2 = function (a) {
        if (null != a && 0 < a.length)return!0;
        this.showError(mxResources.get("error"), mxResources.get("invalidName"), mxResources.get("ok"));
        return false
    };
    null != currentFile && (!title && null != currentFile.getTitle() ? this.save(currentFile.getTitle()) : (title = null != currentFile.getTitle() ? currentFile.getTitle() : this.defaultFilename, title = new FilenameDialog(this, title, mxResources.get("save"), ooUtils.bind(this, arg), null, ooUtils.bind(this, arg2)), this.showDialog(title.container, 300, 100, !0, !0), title.init()))
};
App.prototype.createFile = function (a, b, c, d, e) {
    d = null != d ? d : this.mode;
    if (null != a && this.spinner.spin(document.body, mxResources.get("inserting"))) {
        b = null != b ? b : "";
        var f = ooUtils.bind(this, function (a) {
            this.spinner.stop();
            null == a && null == this.getCurrentFile() && null == this.dialog ? this.showSplash() : null != a && this.handleError(a)
        });
        d == App.MODE_GOOGLE ? this.drive.insertFile(a, b, null != this.stateArg ? this.stateArg.folderId : null, ooUtils.bind(this, function (a) {
            null != this.stateArg ? (this.setCurrentFile(a), window.location.hash =
                a.getHash(), window.location.search = this.getSearch(["state"])) : (null != e && e(), this.spinner.stop(), this.fileCreated(a, c))
        }), f) : d == App.MODE_DROPBOX ? this.dropbox.insertFile(a, b, ooUtils.bind(this, function (a) {
            null != e && e();
            this.spinner.stop();
            this.fileCreated(a, c)
        }), f) : d == App.MODE_BROWSER ? (this.spinner.stop(), d = ooUtils.bind(this, function () {
            var d = new StorageFile(this, b, a);
            d.doSave(a, ooUtils.bind(this, function () {
                null != e && e();
                this.fileCreated(d, c)
            }), f)
        }), null == localStorage.getItem(a) ? d() : this.confirm(mxResources.get("replace",
            [a]), d, ooUtils.bind(this, function () {
            null == this.getCurrentFile() && null == this.dialog && this.showSplash()
        }))) : d == App.MODE_DEVICE && (null != e && e(), this.spinner.stop(), this.fileCreated(new LocalFile(this, b, a), c))
    }
};
App.prototype.fileCreated = function (a, b) {
    if (null != urlParams.create)a.constructor == LocalFile ? this.fileLoaded(a) : this.spinner.spin(document.body, mxResources.get("inserting")) && (this.setCurrentFile(a), window.location.hash = a.getHash(), window.location.search = this.getSearch(["create", "title", "mode"])); else {
        var c = ooUtils.bind(this, function () {
            window.openFile = null;
            this.fileLoaded(a);
            null != b && this.sidebar.showEntries(b)
        });
        if (null != this.getCurrentFile() && (decodeURIComponent(this.getDiagramId()) != decodeURIComponent(a.getHash()) ||
            a.constructor == LocalFile)) {
            var d = window.location.pathname;
            null != b && 0 < b.length && (d += "?libs\x3d" + b);
            d = this.getUrl(d);
            a.constructor == LocalFile ? (window.openFile = new OpenFile(function () {
                window.openFile = null
            }), window.openFile.setData(a.getData(), a.getTitle())) : d += "#" + a.getHash();
            window.openWindow(d, null, c)
        } else c()
    }
};
App.prototype.loadFile = function (a, b) {
    this.hideDialog();
    var c = ooUtils.bind(this, function () {
        if (this.spinner.spin(document.body, mxResources.get("loading")))if ("L" == a.charAt(0))this.spinner.stop(), a = decodeURIComponent(a.substring(1)), this.fileLoaded(new StorageFile(this, localStorage.getItem(a), a)); else {
            var b = this.drive;
            "D" == a.charAt(0) ? (a = decodeURIComponent(a.substring(1)), b = this.dropbox) : "G" == a.charAt(0) && (a = a.substring(1));
            null == b ? this.handleError({message: mxResources.get("serviceUnavailableOrBlocked")},
                mxResources.get("errorLoadingFile"), ooUtils.bind(this, function () {
                    var a = this.getCurrentFile();
                    window.location.hash = null != a ? a.getHash() : ""
                })) : b.getFile(a, ooUtils.bind(this, function (a) {
                this.spinner.stop();
                this.fileLoaded(a)
            }), ooUtils.bind(this, function (a) {
                this.handleError(a, null != a ? mxResources.get("errorLoadingFile") : null, ooUtils.bind(this, function () {
                    var a = this.getCurrentFile();
                    window.location.hash = null != a ? a.getHash() : ""
                }))
            }))
        }
    });
    null == a || 0 == a.length ? (this.editor.setStatus(""), this.fileLoaded(null)) :
        null != this.getCurrentFile() && !b ? window.openWindow(this.getUrl() + "#" + a, null, c) : c()
};
App.prototype.loadLibrary = function (a) {
    var b = ooUtils.parseXml(a.getData());
    if ("mxlibrary" == b.documentElement.nodeName)b = JSON.parse(ooUtils.getTextContent(b.documentElement)), this.libraryLoaded(a, b); else throw{message: mxResources.get("notALibraryFile")};
};
App.prototype.libraryLoaded = function (a, b) {
    var c = ooUtils.bind(this, function (a) {
        var b = this.sidebar.palettes[a];
        if (null != b) {
            for (var c = 0; c < b.length; c++)b[c].parentNode.removeChild(b[c]);
            delete this.sidebar.palettes[a]
        }
    });
    c(a.getHash());
    mxSettings.addCustomLibrary(a.getHash());
    mxSettings.save();
    var d = this.sidebar.addPalette(a.getHash(), a.getTitle(), !0, ooUtils.bind(this, function (a) {
        for (var c = 0; c < b.length; c++) {
            var e = b[c], d = e.data;
            if (null != d) {
                if ("data:" == d.substring(0, 5)) {
                    var f = d.indexOf(";");
                    0 < f && (d = d.substring(0,
                        f) + d.substring(d.indexOf(",", f + 1)))
                }
                a.appendChild(this.sidebar.createVertexTemplate("shape\x3dimage;verticalLabelPosition\x3dbottom;verticalAlign\x3dtop;imageAspect\x3d0;image\x3d" + d, e.w, e.h, "", "", !1, !1))
            }
        }
    })), e = d.parentNode.previousSibling, f = this.sidebar.container;
    f.insertBefore(f.lastChild, f.firstChild);
    f.insertBefore(f.lastChild, f.firstChild);
    mxClient.IS_FF && (e.style.whiteSpace = "normal");
    f = document.createElement("img");
    f.setAttribute("src", IMAGE_PATH + "/close.png");
    f.setAttribute("title", mxResources.get("close"));
    f.setAttribute("align", "top");
    f.setAttribute("border", "0");
    f.style.cssFloat = "right";
    f.style.cursor = "pointer";
    f.style.marginRight = "8px";
    f.style.marginTop = "2px";
    e.appendChild(f);
    mxEvent.addListener(f, "click", function (b) {
        c(a.getHash());
        mxSettings.removeCustomLibrary(a.getHash());
        mxSettings.save();
        mxEvent.consume(b)
    });
    a.isEditable() && (f = document.createElement("img"), f.setAttribute("src", IMAGE_PATH + "/edit.png"), f.setAttribute("title", mxResources.get("edit")), f.setAttribute("align", "top"), f.setAttribute("border",
        "0"), f.style.cssFloat = "right", f.style.marginRight = "8px", f.style.marginTop = "2px", e.appendChild(f), mxEvent.addListener(f, "click", ooUtils.bind(this, function (c) {
        this.showLibraryDialog(a.getTitle(), d, b, a);
        mxEvent.consume(c)
    })))
};
App.prototype.fileLoaded = function (file) {
    this.hideDialog();
    var currentFile = this.getCurrentFile();
    null != currentFile && (currentFile.removeListener(this.descriptorChangedListener), currentFile.close());
    this.editor.graph.model.clear();
    this.editor.undoManager.clear();
    var c = ooUtils.bind(this, function () {
        this.editor.graph.model.clear();
        this.editor.undoManager.clear();
        this.setCurrentFile(null);
        this.diagramContainer.style.visibility = "hidden";
        this.editor.graph.setEnabled(false);
        this.updateDocumentTitle();
        null != window.location.hash && 0 < window.location.hash.length && (window.location.hash = "");
        null != this.fname && (this.fname.style.display = "none", this.fname.innerHTML = "", this.fname.setAttribute("title", mxResources.get("rename")));
        this.updateUi();
        this.showSplash()
    });
    if (null != file) try {
        file.open();
        this.setCurrentFile(file);
        this.diagramContainer.style.visibility = "";
        file.addListener("descriptorChanged", this.descriptorChangedListener);
        file.addListener("contentChanged", this.descriptorChangedListener);
        this.descriptorChanged();
        this.editor.undoManager.clear();
        this.setMode(file.getMode());
        this.updateUi();
        file.isEditable() ? this.editor.setStatus("") : this.editor.setStatus(mxResources.get("readOnly"));
        this.showLayersDialog();
        this.restoreLibraries();
        this.editor.fireEvent(new mxEventObject("fileLoaded"))
    }
    catch (error) {

        console.log("error loading file", file, error);
        this.handleError(error, mxResources.get("errorLoadingFile"),
            ooUtils.bind(this, function () {
                null != urlParams.url && this.spinner.spin(document.body, mxResources.get("reconnecting")) ? window.location.search = this.getSearch(["url"]) : c()
            }));

    } else c()
};
App.prototype.restoreLibraries = function () {
    var a = this.getCurrentFile();
    if (null != a && null != this.sidebar && a.getMode() == App.MODE_GOOGLE)for (var a = mxSettings.getCustomLibraries(), b = 0; b < a.length; b++)if (null == this.sidebar.palettes[a[b]]) {
        var c = a[b].substring(1);
        this.drive.getFile(c, ooUtils.bind(this, function (a) {
            try {
                this.loadLibrary(a)
            } catch (b) {
            }
        }), function (a) {
        })
    }
};
App.prototype.updateActionStates = function () {
    EditorUi.prototype.updateActionStates.apply(this, arguments);
    var a = this.getCurrentFile(), a = null != a && a.isEditable() || "1" == urlParams.embed;
//    this.actions.get("documentProperties").setEnabled(a);
    this.actions.get("guides").setEnabled(a);
    this.actions.get("grid").setEnabled(a);
    a = this.editor.graph;
//    this.actions.get("editGeometry").setEnabled(a.getModel().isVertex(a.getSelectionCell()))
};
App.prototype.updateUi = function () {
    var a = this.getCurrentFile(), b = null != a || "1" == urlParams.embed, a = null != a && a.isEditable();
    this.updateActionStates();
    this.actions.get("save").setEnabled(b);
    this.actions.get("saveAs").setEnabled(b);
//    this.actions.get("rename").setEnabled(b);
    this.actions.get("import").setEnabled(b);
    this.actions.get("pageSetup").setEnabled(b);
    this.actions.get("print").setEnabled(b);
    this.actions.get("editFile").setEnabled(b);
//    this.actions.get("share").setEnabled(b);
//    this.actions.get("chatWindowTitle").setEnabled(b);
//    this.actions.get("makeCopy").setEnabled(b);
//    this.actions.get("moveToFolder").setEnabled(b);
    this.actions.get("image").setEnabled(b);
    this.actions.get("zoomIn").setEnabled(b);
    this.actions.get("zoomOut").setEnabled(b);
    this.actions.get("actualSize").setEnabled(b);
    this.menus.get("edit").setEnabled(b);
    this.menus.get("view").setEnabled(b);
    this.menus.get("format").setEnabled(a);
    this.menus.get("text").setEnabled(a);
    this.menus.get("options").setEnabled(b);
//    this.menus.get("downloadAs").setEnabled(b);
//    this.menus.get("importFrom").setEnabled(b);
//    this.menus.get("embed").setEnabled(b);
    this.menus.get("arrange").setEnabled(a);
    if (this.isOfflineApp()) {
        if ((mxClient.IS_GC || mxClient.IS_IOS && mxClient.IS_SF) && null != applicationCache) {
            var c = applicationCache;
            if (null == this.offlineStatus) {
                this.offlineStatus = document.createElement("div");
                this.offlineStatus.className = "geItem";
                this.offlineStatus.style.position = "absolute";
                this.offlineStatus.style.fontSize = "8pt";
                this.offlineStatus.style.top = "2px";
                this.offlineStatus.style.right = "12px";
                this.offlineStatus.style.color =
                    "#666";
                this.offlineStatus.style.margin = "4px";
                this.offlineStatus.style.padding = "2px";
                this.offlineStatus.style.verticalAlign = "middle";
                this.offlineStatus.innerHTML = "";
                this.menubarContainer.appendChild(this.offlineStatus);
                var d = window.setTimeout(ooUtils.bind(this, function () {
                    c.status == c.IDLE && (this.offlineStatus.innerHTML = '[\x3cimg title\x3d"Cached" border\x3d"0" src\x3d"' + IMAGE_PATH + '/checkmark.gif"/\x3e]', window.clearTimeout(d))
                }), 5E3)
            }
        }
    } else this.updateUserElement()
};
App.prototype.save = function (title) {
    var currentFile = this.getCurrentFile();
    var callbackSaved = function (a) {
        this.spinner.stop();
        this.editor.setStatus(mxResources.get("allChangesSaved"))
    };

    var callbackError = function (a) {
        this.editor.setStatus("");
        this.handleError(a, null != a ? mxResources.get("errorSavingFile") : null)
    };

    this.spinner.spin(document.body, mxResources.get("saving"));

    if (title == currentFile.getTitle()) {
        currentFile.save(true, ooUtils.bind(this, callbackSaved), ooUtils.bind(this, callbackError))
    } else {
        currentFile.saveAs(title, ooUtils.bind(this, callbackSaved),ooUtils.bind(this, callbackError));
    }
};

App.prototype.base64toBlob = function (a, b) {
    contentType = contentType || "";
    for (var c = atob(base64Data), d = c.length, e = Math.ceil(d / 1024), f = Array(e), g = 0; g < e; ++g) {
        for (var l = 1024 * g, k = Math.min(l + 1024, d), m = Array(k - l), n = 0; l < k; ++n, ++l)m[n] = c[l].charCodeAt(0);
        f[g] = new Uint8Array(m)
    }
    return new Blob(f, {type: contentType})
};
App.prototype.saveLocalFile = function (a, b, c) {
    if (mxClient.IS_QUIRKS || 8 <= document.documentMode)c = window.open("about:blank", "_blank"), c.document.write(a), c.document.close(), c.document.execCommand("SaveAs", !0, b), c.close(); else if (mxClient.IS_IOS)a = new TextareaDialog(this, b + ":", a, null, null, mxResources.get("close")), a.textarea.style.width = "600px", a.textarea.style.height = "380px", this.showDialog(a.container, 620, 460, !0, !0), a.init(), document.execCommand("selectall"); else if (mxClient.IS_SF)window.open("data:" +
        c + "," + encodeURIComponent(a), b); else {
        var d = document.createElement("a");
        d.href = URL.createObjectURL(new Blob([a], {type: c}));
        d.download = b;
        document.body.appendChild(d);
        try {
            d.click(), d.parentNode.removeChild(d)
        } catch (e) {
        }
    }
};
App.prototype.downloadFile = function (a, b) {
    var c = this.getCurrentFile();
    if (null != c) {
        var d = null != c.getTitle() ? c.getTitle() : this.defaultFilename;
        ".xml" == d.substring(d.length - 4).toLowerCase() && (d = d.substring(0, d.length - 4));
        c = d + "." + a;
        if ("xml" == a) {
            var e = b ? ooUtils.getXml(this.editor.getGraphXml()) : this.getFileData();
            if (this.isOfflineApp() || mxClient.IS_IOS)this.saveLocalFile(e, c, "text/xml"); else {
                var f = "undefined" === typeof Zlib ? "\x26xml\x3d" + encodeURIComponent(e) : "\x26data\x3d" + encodeURIComponent(this.editor.compress(e));
                (new mxXmlRequest(SAVE_URL, "filename\x3d" + encodeURIComponent(c) + "\x26format\x3d" + a + f)).simulate(document, "_blank")
            }
        } else if ("html" == a) {
            for (var f = this.editor.graph, g = f.getGraphBounds(), l = f.view.scale, e = Math.floor(g.x / l - f.view.translate.x), k = Math.floor(g.y / l - f.view.translate.y), m = this.editor.getGraphXml(), f = "", n = {}, p = this.editor.graph.view.states.getValues(), q = 0; q < p.length; q++) {
                var r = mxStencilRegistry.getBasenameForStencil(p[q].style[mxConstants.STYLE_SHAPE]);
                null != r && null == n[r] && (n[r] = !0, f += r + ";")
            }
            0 <
                f.length && (f = "?s\x3d" + f.substring(0, f.length - 1));
            m.setAttribute("x0", e);
            m.setAttribute("y0", k);
            m.setAttribute("pan", "1");
            m.setAttribute("zoom", "1");
            m.setAttribute("resize", "1");
            m.setAttribute("fit", "0");
            m.setAttribute("border", "");
            m.setAttribute("links", "1");
            e = this.editor.compress(ooUtils.getXml(m));
            l = "position:relative;overflow:hidden;width:" + Math.ceil(g.width / l) + "px;height:" + Math.ceil(g.height / l) + "px;";
            g = this.editor.graph.background;
            d = '\x3c!--[if IE]\x3e\x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3d5,IE\x3d9" \x3e\x3c![endif]--\x3e\x3c!DOCTYPE html\x3e\x3chtml\x3e\n\x3chead\x3e\n\x3ctitle\x3e' +
                d + "\x3c/title\x3e\n\x3c/head\x3e\n\x3cbody" + (null != g && "none" != g ? ' style\x3d"background-color:' + g + ';"\x3e' : "\x3e") + '\n\x3cdiv class\x3d"mxgraph" style\x3d"' + l + '"\x3e\n\x3cdiv style\x3d"width:1px;height:1px;overflow:hidden;"\x3e' + e + '\x3c/div\x3e\n\x3c/div\x3e\n\x3cscript type\x3d"text/javascript" src\x3d"https://www.draw.io/embed.js' + f + '"\x3e\x3c/script\x3e\n\x3c/body\x3e\n\x3c/html\x3e';
            this.isOfflineApp() || mxClient.IS_IOS ? this.saveLocalFile(d, c, "text/html") : (f = "undefined" === typeof Zlib ? "\x26xml\x3d" +
                encodeURIComponent(d) : "\x26data\x3d" + encodeURIComponent(this.editor.compress(d)), (new mxXmlRequest(SAVE_URL, "filename\x3d" + encodeURIComponent(c) + "\x26format\x3d" + a + f)).simulate(document, "_blank"))
        } else"xmlpng" == a || "svg" != a && this.editor.graph.mathEnabled ? (f = "xmlpng" == a ? "1" : "0", "xmlpng" == a && (a = "png", c = d + "." + a), (new mxXmlRequest(EXPORT_URL, "filename\x3d" + encodeURIComponent(c) + "\x26format\x3d" + a + "\x26embedXml\x3d" + f + "\x26math\x3d" + (this.editor.graph.mathEnabled ? "1" : "0") + "\x26xml\x3d" + encodeURIComponent(this.getFileData()))).simulate(document,
            "_blank")) : (g = this.editor.graph.background, "none" == g && (g = null), null == g && "jpg" == a && (g = "#ffffff"), mxSvgCanvas2D.prototype.foAltText = "svg" == a ? "[Not supported by viewer]" : null, l = this.editor.graph.getSvg(g, null, null, "pdf" == a && this.editor.graph.pageVisible), f = ooUtils.getXml(l), f.length <= MAX_REQUEST_SIZE ? "svg" == a ? this.isOfflineApp() || mxClient.IS_IOS ? this.saveLocalFile(f, c, "image/svg+xml") : (f = "undefined" === typeof Zlib ? "\x26xml\x3d" + encodeURIComponent(f) : "\x26data\x3d" + encodeURIComponent(this.editor.compress(f)),
            (new mxXmlRequest(SAVE_URL, "filename\x3d" + encodeURIComponent(c) + "\x26format\x3d" + a + f)).simulate(document, "_blank")) : (d = parseInt(l.getAttribute("width")), l = parseInt(l.getAttribute("height")), 0 < d && 0 < l && d * l < MAX_AREA && (g = null != g ? "\x26bg\x3d" + g : "", f = "undefined" === typeof Zlib ? "\x26svg\x3d" + encodeURIComponent(f) : "\x26svgdata\x3d" + encodeURIComponent(this.editor.compress(f)), (new mxXmlRequest(EXPORT_URL, "filename\x3d" + encodeURIComponent(c) + "\x26format\x3d" + a + g + "\x26w\x3d" + d + "\x26h\x3d" + l + f)).simulate(document,
            "_blank"))) : (ooUtils.alert(mxResources.get("drawingTooLarge")), ooUtils.popup(f)))
    }
};
App.prototype.formatFileSize = function (a) {
    var b = -1;
    do a /= 1024, b++; while (1024 < a);
    return Math.max(a, 0.1).toFixed(1) + " kB; MB; GB; TB;PB;EB;ZB;YB".split(";")[b]
};
App.prototype.descriptorChanged = function () {
    var a = this.getCurrentFile();
    if (null != a) {
        if (null != this.fname) {
            this.fname.style.display = "inline-block";
            this.fname.innerHTML = "";
            var b = null != a.getTitle() ? a.getTitle() : this.defaultFilename;
            ooUtils.write(this.fname, b);
            this.fname.setAttribute("title", b + " - " + mxResources.get("rename"))
        }
        this.editor.graph.setEnabled(a.isEditable());
        this.updateDocumentTitle();
        a = a.getHash();
        0 < a.length ? window.location.hash = a : 0 < window.location.hash.length && (window.location.hash = "")
    }
};
App.prototype.handleError = function (a, b, c) {
    var d = this.spinner.pause(), e = null != a && null != a.error ? a.error : a;
    if (null != e || null != b) {
        a = mxResources.get("unknownError");
        var f = mxResources.get("ok"), g = null;
        b = null != b ? b : mxResources.get("error");
        null != e && ("undefined" != typeof gapi && "undefined" != typeof gapi.drive && "undefined" != typeof gapi.drive.realtime && e.type == gapi.drive.realtime.ErrorType.FORBIDDEN ? a = mxResources.get("forbidden") : 404 == e.code || "undefined" != typeof gapi && "undefined" != typeof gapi.drive && "undefined" != typeof gapi.drive.realtime && e.type == gapi.drive.realtime.ErrorType.NOT_FOUND ? a = mxResources.get("fileNotFoundOrDenied") : e.code == App.ERROR_TIMEOUT ? (a = mxResources.get("timeout"), null != e.retry && (f = mxResources.get("cancel"), g = function () {
            d();
            e.retry()
        })) : null != e.message && (a = e.message));
        this.showError(b, a, f, c, g)
    } else null != c && c()
};
App.prototype.showError = function (a, b, c, d, e, f, g) {
    a = new ErrorDialog(this, a, b, c, d, e, f, g);
    this.showDialog(a.container, 340, 150, !0, !1);
    a.init()
};
App.prototype.alert = function (a, b) {
    var errorDialog = new ErrorDialog(this, null, a, mxResources.get("ok"), b);
    this.showDialog(errorDialog.container, 340, 100, !0, !1);
    errorDialog.init()
};
App.prototype.confirm = function (a, b, c) {
    var d = null != this.spinner.pause ? this.spinner.pause() : function () {};
    this.showDialog((new ConfirmDialog(this, a, function () {
        d();
        null != b && b()
    }, function () {
        d();
        null != c && c()
    })).container, 340, 90, !0, !1)
};
App.prototype.toggleChat = function () {
    var a = this.getCurrentFile();
    if (null != a) {
        if (null == a.chatWindow) {
            var b = document.body.offsetWidth - 300;
            a.chatWindow = new ChatWindow(mxResources.get("chatWindowTitle"), document.getElementById("geChat"), b, 80, 250, 350, a.realtime);
            a.chatWindow.window.setVisible(false)
        }
        a.chatWindow.window.setVisible(!a.chatWindow.window.isVisible())
    }
};
App.prototype.status = function (a) {
    this.editor.setStatus(a)
};
App.prototype.showAuthDialog = function (a, b, c) {
    var d = this.spinner.pause();
    this.showDialog((new AuthDialog(this, a, b, ooUtils.bind(this, function (a) {
        try {
            null != c && c(a, function () {
                d()
            })
        } catch (b) {
            this.editor.setStatus(b.message)
        }
    }))).container, 300, b ? 180 : 140, !0, !0, ooUtils.bind(this, function (a) {
        a && null == this.getCurrentFile() && null == this.dialog && this.showSplash()
    }))
};
App.prototype.loadUrl = function (a, b, c) {
    try {
        var d = ooUtils.bind(this, function () {
            var e = 0 < navigator.userAgent.indexOf("MSIE 9") ? new XDomainRequest : new XMLHttpRequest;
            e.open("GET", a);
            e.timeout = this.timeout;
            e.onload = ooUtils.bind(this, function () {
                var a = null != e.getText ? e.getText() : e.responseText;
                null != a && (null == e.status || 200 == e.status) ? null != b && b(a) : null != c && c({code: App.ERROR_UNKNOWN})
            });
            e.onerror = function () {
                null != c && c({code: App.ERROR_UNKNOWN})
            };
            e.ontimeout = function () {
                null != c && c({code: App.ERROR_TIMEOUT, retry: d})
            };
            e.send()
        });
        d()
    } catch (e) {
        c(e)
    }
};
App.prototype.updateHeader = function () {
    if (null != this.menubar) {
        this.appIcon = document.createElement("a");
        this.appIcon.style.display = "block";
        this.appIcon.style.position = "absolute";
        this.appIcon.style.width = "40px";
        this.appIcon.style.backgroundColor = "#fe890c";
        this.appIcon.style.height = this.menubarHeight + "px";
        mxEvent.disableContextMenu(this.appIcon);
        mxEvent.addListener(this.appIcon, "click", ooUtils.bind(this, function (a) {
            mxEvent.isAltDown(a) && (this.showSplash(true), mxEvent.consume(a))
        }));
        var a = isSvgBrowser ? "url('" +
            IMAGE_PATH + "/logo-white.svg')" : "url('" + IMAGE_PATH + "/logo-white.png')";
        this.appIcon.style.backgroundImage = a;
        this.appIcon.style.backgroundPosition = "center center";
        this.appIcon.style.backgroundRepeat = "no-repeat";
        var style = this.appIcon.style;
//        ooUtils.setPrefixedStyle(style, "transition", "all 125ms linear");
        mxEvent.addListener(this.appIcon, "mouseover", ooUtils.bind(this, function () {
            this.mode == App.MODE_GOOGLE ? this.appIcon.style.backgroundImage = "url(" + IMAGE_PATH + "/google-drive-logo-white.svg)" : this.mode == App.MODE_DROPBOX &&
                (this.appIcon.style.backgroundImage = "url(" + IMAGE_PATH + "/dropbox-logo-white.svg)")
        }));
        mxEvent.addListener(this.appIcon, "mouseout", ooUtils.bind(this, function () {
            this.appIcon.style.backgroundImage = a
        }));
        this.menubarContainer.appendChild(this.appIcon);
        this.fname = document.createElement("a");
        this.fname.setAttribute("href", "javascript:void(0);");
        this.fname.setAttribute("title", mxResources.get("rename"));
        this.fname.className = "geItem";
        this.fname.style.fontSize = "18px";
        this.fname.style.display = "none";
        this.fname.style.position =
            "absolute";
        this.fname.style.padding = "2px 8px 2px 8px";
        this.fname.style.right = "120px";
        this.fname.style.left = "50px";
        this.fname.style.top = "4px";
        this.fname.style.overflow = "hidden";
        this.fname.style.whiteSpace = "nowrap";
        this.fname.style.textOverflow = "ellipsis";
        mxEvent.addListener(this.fname, "click", ooUtils.bind(this, function () {
            var a = this.getCurrentFile();
            null != a && a.isRenamable() && this.actions.get("rename").funct()
        }));
        this.menubarContainer.appendChild(this.fname);
        this.menubar.container.style.position = "absolute";
        this.menubar.container.style.paddingLeft = "52px";
        this.menubar.container.style.top = "29px";
        this.toolbar.container.style.paddingLeft = "56px";
        "1" != urlParams.embed && "" != urlParams.url && (this.toggleElement = document.createElement("a"), this.toggleElement.setAttribute("href", "javascript:void(0);"), this.toggleElement.className = "geButton", this.toggleElement.style.position = "absolute", this.toggleElement.style.display = "inline-block", this.toggleElement.style.verticalAlign = "bottom", this.toggleElement.style.width = "16px",
            this.toggleElement.style.height = "16px", this.toggleElement.style.color = "#666", this.toggleElement.style.top = "4px", this.toggleElement.style.right = "10px", this.toggleElement.style.padding = "2px", this.toggleElement.style.fontSize = "14px", this.toggleElement.style.textDecoration = "none", this.toggleElement.style.verticalAlign = "middle", this.toggleElement.style.backgroundImage = 'url("' + IMAGE_PATH + '/chevron-up.png")', this.toggleElement.style.backgroundPosition = "50% 50%", this.toggleElement.style.backgroundRepeat =
            "no-repeat", mxEvent.addListener(this.toggleElement, "click", ooUtils.bind(this, function (a) {
            "none" == this.appIcon.style.display ? (this.menubar.container.style.position = "absolute", this.menubar.container.style.paddingLeft = "52px", this.menubar.container.style.top = "29px", this.toolbar.container.style.paddingLeft = "56px", this.appIcon.style.display = "block", this.fname.style.display = "inline-block", this.fname.style.visibility = "visible", this.menubarHeight = App.prototype.menubarHeight, this.refresh(), this.toggleElement.style.backgroundImage =
                'url("' + IMAGE_PATH + '/chevron-up.png")') : (this.menubar.container.style.position = "relative", this.menubar.container.style.paddingLeft = "4px", this.menubar.container.style.top = "0px", this.toolbar.container.style.paddingLeft = "4px", this.appIcon.style.display = "none", this.fname.style.display = "none", this.fname.style.visibility = "hidden", this.menubarHeight = EditorUi.prototype.menubarHeight, this.refresh(), this.toggleElement.style.backgroundImage = 'url("' + IMAGE_PATH + '/chevron-down.png")');
            mxEvent.consume(a)
        })), this.toolbarContainer.appendChild(this.toggleElement))
    }
};
App.prototype.updateUserElement = function () {
    if (this.mode != App.MODE_GOOGLE && this.mode != App.MODE_DROPBOX || (null == this.drive || null == this.drive.getUser()) && (null == this.dropbox || null == this.dropbox.getUser()))null != this.userElement && (this.userElement.parentNode.removeChild(this.userElement), this.userElement = null); else {
        null == this.userElement && (this.userElement = document.createElement("a"), this.userElement.setAttribute("href", "javascript:void(0);"), this.userElement.className = "geItem", this.userElement.style.position =
            "absolute", this.userElement.style.fontSize = "8pt", this.userElement.style.top = "2px", this.userElement.style.right = "28px", this.userElement.style.color = "#666", this.userElement.style.margin = "4px", this.userElement.style.padding = "2px", this.userElement.style.paddingRight = "16px", this.userElement.style.verticalAlign = "middle", this.userElement.style.backgroundImage = "url(" + IMAGE_PATH + "/expanded.gif)", this.userElement.style.backgroundPosition = "100% 60%", this.userElement.style.backgroundRepeat = "no-repeat", this.menubarContainer.appendChild(this.userElement),
            mxEvent.addListener(this.userElement, "click", ooUtils.bind(this, function (a) {
                if (null == this.userPanel) {
                    var c = document.createElement("div");
                    c.className = "geDialog";
                    c.style.position = "absolute";
                    c.style.top = this.userElement.clientTop + this.userElement.clientHeight + 6 + "px";
                    c.style.right = "30px";
                    c.style.padding = "0px";
                    this.userPanel = c
                }
                null != this.userPanel.parentNode ? this.userPanel.parentNode.removeChild(this.userPanel) : (this.userPanel.innerHTML = "", c = document.createElement("img"), c.setAttribute("src", IMAGE_PATH +
                    "/close.png"), c.setAttribute("title", mxResources.get("close")), c.className = "geDialogClose", c.style.top = "8px", c.style.right = "8px", mxEvent.addListener(c, "click", ooUtils.bind(this, function () {
                    null != this.userPanel.parentNode && this.userPanel.parentNode.removeChild(this.userPanel)
                })), this.userPanel.appendChild(c), this.mode == App.MODE_GOOGLE && null != this.drive ? (c = this.drive.getUser(), null != c && (this.userPanel.innerHTML += '\x3ctable title\x3d"User ID: ' + c.id + '" style\x3d"font-size:10pt;padding:20px 20px 10px 10px;"\x3e\x3ctr\x3e\x3ctd valign\x3d"top"\x3e\x3cimg style\x3d"margin-right:10px;" src\x3d"' +
                    (null != c.pictureUrl ? c.pictureUrl : this.defaultUserPicture) + '"/\x3e\x3c/td\x3e\x3ctd valign\x3d"top" style\x3d"white-space:nowrap;padding-top:6px;"\x3e\x3cb\x3e' + ooUtils.htmlEntities(c.displayName) + "\x3c/b\x3e\x3c/tr\x3e\x3c/table\x3e", c = document.createElement("div"), c.style.textAlign = "center", c.style.padding = "10px", c.style.background = "whiteSmoke", c.style.borderTop = "1px solid #e0e0e0", c.style.whiteSpace = "nowrap", c.appendChild(ooUtils.button(mxResources.get("signOut"), ooUtils.bind(this, function () {
                    this.drive.clearUserId();
                    this.drive.setUser(null);
                    gapi.auth.signOut()
                }))), this.userPanel.appendChild(c))) : this.mode == App.MODE_DROPBOX && null != this.dropbox ? (c = this.dropbox.getUser(), null != c && (this.userPanel.innerHTML += '\x3ctable style\x3d"font-size:10pt;padding:20px 20px 10px 10px;"\x3e\x3ctr\x3e\x3ctd valign\x3d"top"\x3e\x3cimg style\x3d"margin-right:10px;" src\x3d"images/dropbox-logo.svg" width\x3d"40" height\x3d"40"/\x3e\x3c/td\x3e\x3ctd valign\x3d"top" style\x3d"white-space:nowrap;"\x3e\x3cb\x3e' + ooUtils.htmlEntities(c.displayName) +
                    '\x3c/b\x3e\x3cbr\x3e\x3cfont color\x3d"gray"\x3e' + ooUtils.htmlEntities(c.email) + "\x3c/font\x3e\x3c/tr\x3e\x3c/table\x3e", c = document.createElement("div"), c.style.textAlign = "center", c.style.padding = "10px", c.style.background = "whiteSmoke", c.style.borderTop = "1px solid #e0e0e0", c.style.whiteSpace = "nowrap", c.appendChild(ooUtils.button(mxResources.get("signOut"), ooUtils.bind(this, function () {
                    this.dropbox.signOut()
                }))), this.userPanel.appendChild(c))) : (c = document.createElement("div"), c.style.textAlign = "center",
                    c.style.padding = "20px 20px 10px 10px", c.innerHTML = mxResources.get("notConnected"), this.userPanel.appendChild(c)), document.body.appendChild(this.userPanel));
                mxEvent.consume(a)
            })), mxEvent.addListener(document.body, "click", ooUtils.bind(this, function (a) {
            !mxEvent.isConsumed(a) && null != this.userPanel && null != this.userPanel.parentNode && this.userPanel.parentNode.removeChild(this.userPanel)
        })));
        var a = this.mode == App.MODE_DROPBOX ? null != this.dropbox ? this.dropbox.getUser() : null : null != this.drive ? this.drive.getUser() :
            null;
        null != a ? (this.userElement.innerHTML = "", ooUtils.write(this.userElement, a.displayName), this.userElement.style.display = "block") : this.userElement.style.display = "none"
    }
};