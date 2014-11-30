EditorUi = function (a, b) {
    mxEventSource.call(this);
    this.editor = a || new Editor;
    this.container = b || document.body;
    var c = this.editor.graph;
    (new Image).src = mxPopupMenu.prototype.submenuImage;
    null != mxConnectionHandler.prototype.connectImage && ((new Image).src = mxConnectionHandler.prototype.connectImage.src);
    this.editor.chromeless && (this.footerHeight = 0, c.isEnabled = function () {
        return!1
    }, c.panningHandler.isForcePanningEvent = function () {
        return!0
    });
    this.actions = new Actions(this);
    this.menus = new Menus(this);
    this.createDivs();
    this.createUi();
    this.refresh();
    var d = mxUtils.bind(this, function (a) {
        null == a && (a = window.event);
        return this.isSelectionAllowed(a) ? !0 : c.isEditing()
    });
    this.container == document.body && (this.menubarContainer.onselectstart = d, this.menubarContainer.onmousedown = d, this.toolbarContainer.onselectstart = d, this.toolbarContainer.onmousedown = d, this.diagramContainer.onselectstart = d, this.diagramContainer.onmousedown = d, this.sidebarContainer.onselectstart = d, this.sidebarContainer.onmousedown = d, this.formatContainer.onselectstart =
        d, this.formatContainer.onmousedown = d, this.footerContainer.onselectstart = d, this.footerContainer.onmousedown = d);
    mxClient.IS_IE && ("undefined" === typeof document.documentMode || 9 > document.documentMode) ? mxEvent.addListener(this.diagramContainer, "contextmenu", d) : this.diagramContainer.oncontextmenu = d;
    c.init(this.diagramContainer);
    var e = !1, f = null, g = mxUtils.bind(this, function () {
        if (e != c.cellEditor.isContentEditing()) {
            for (var a = this.toolbar.container.firstChild, b = []; null != a;) {
                var d = a.nextSibling;
                a.parentNode.removeChild(a);
                b.push(a);
                a = d
            }
            if (null == f)this.toolbar.createTextToolbar(); else for (a = 0; a < f.length; a++)this.toolbar.container.appendChild(f[a]);
            e = c.cellEditor.isContentEditing();
            f = b
        }
    }), l = c.cellEditor.isStopEditingEvent;
    c.cellEditor.isStopEditingEvent = function (a) {
        return l.apply(this, arguments) || 13 == a.keyCode && mxEvent.isControlDown(a)
    };
    var k = c.cellEditor.startEditing;
    c.cellEditor.startEditing = function () {
        k.apply(this, arguments);
        g()
    };
    var m = c.cellEditor.stopEditing;
    c.cellEditor.stopEditing = function (a, b) {
        m.apply(this, arguments);
        g()
    };
    c.container.setAttribute("tabindex", "0");
    c.container.style.cursor = "default";
    c.container.style.backgroundImage = "url(" + a.gridImage + ")";
    c.container.style.backgroundPosition = "-1px -1px";
    d = mxClient.IS_IE && 9 <= document.documentMode ? "url(" + this.editor.transparentImage + ")" : "none";
    c.container.style.backgroundImage = d;
    d = !c.pageVisible && c.isGridEnabled() ? "url(" + this.editor.gridImage + ")" : d;
    null != c.view.canvas.ownerSVGElement ? c.view.canvas.ownerSVGElement.style.backgroundImage = d : c.view.canvas.style.backgroundImage =
        d;
    c.container.focus();
    var n = c.fireMouseEvent;
    c.fireMouseEvent = function (a, b, c) {
        a == mxEvent.MOUSE_DOWN && this.container.focus();
        n.apply(this, arguments)
    };
    c.popupMenuHandler.autoExpand = !0;
    c.popupMenuHandler.factoryMethod = mxUtils.bind(this, function (a, b, c) {
        this.menus.createPopupMenu(a, b, c)
    });
    mxEvent.addGestureListeners(document, mxUtils.bind(this, function (a) {
        c.popupMenuHandler.hideMenu()
    }));
    this.keyHandler = this.createKeyHandler(a);
    this.getKeyHandler = function () {
        return keyHandler
    };
    var p = ["shadow", "dashed", "dashPattern"],
        q = ["shape", "edgeStyle", "curved", "rounded", "elbow"], r = {edgeStyle: "orthogonalEdgeStyle", rounded: "0", html: "1"}, u = {};
    this.setDefaultStyle = function (a) {
        var b = c.view.getState(a);
        if (null != a) {
            a = a.clone();
            a.style = "";
            a = c.getCellStyle(a);
            var e = [], d = [], f;
            for (f in b.style)a[f] != b.style[f] && (e.push(b.style[f]), d.push(f));
            f = c.getModel().getStyle(b.cell);
            for (var g = null != f ? f.split(";") : [], l = 0; l < g.length; l++) {
                var k = g[l], m = k.indexOf("\x3d");
                0 <= m && (f = k.substring(0, m), k = k.substring(m + 1), null != a[f] && "none" == k && (e.push(k),
                    d.push(f)))
            }
            c.getModel().isEdge(b.cell) ? r = {} : u = {};
            this.fireEvent(new mxEventObject("styleChanged", "keys", d, "values", e, "cells", [b.cell]))
        }
    };
    this.resetDefaultStyle = function () {
        r = {edgeStyle: "orthogonalEdgeStyle", rounded: "0", html: "1"};
        u = {}
    };
    var v = "", x;
    for (x in r)v += x + "\x3d" + r[x] + ";";
    c.connectionHandler.createEdgeState = function (a) {
        a = c.createEdge(null, null, null, null, null, v);
        return new mxCellState(c.view, a, c.getCellStyle(a))
    };
    var y = ["fontFamily", "fontSize", "fontColor"], s = "edgeStyle startArrow startFill startSize endArrow endFill endSize".split(" "),
        t = ["startArrow startFill startSize endArrow endFill endSize".split(" "), ["strokeColor", "strokeWidth"], ["fillColor", "gradientColor"], y, ["align"], ["html"]];
    for (x = 0; x < t.length; x++)for (d = 0; d < t[x].length; d++)p.push(t[x][d]);
    for (x = 0; x < q.length; x++)p.push(q[x]);
    var z = function (a) {
        c.getModel().beginUpdate();
        try {
            for (var b = 0; b < a.length; b++) {
                for (var e = a[b], d = c.getModel().getStyle(e), f = null != d ? d.split(";") : [], g = p.slice(), l = 0; l < f.length; l++) {
                    var k = f[l], m = k.indexOf("\x3d");
                    if (0 <= m) {
                        var n = k.substring(0, m), v = mxUtils.indexOf(g,
                            n);
                        0 <= v && g.splice(v, 1);
                        for (var s = 0; s < t.length; s++) {
                            var x = t[s];
                            if (0 <= mxUtils.indexOf(x, n))for (var y = 0; y < x.length; y++) {
                                var z = mxUtils.indexOf(g, x[y]);
                                0 <= z && g.splice(z, 1)
                            }
                        }
                    }
                }
                c.convertValueToString(e);
                for (var L = c.getModel().isEdge(e), s = L ? r : u, l = 0; l < g.length; l++) {
                    var n = g[l], O = s[n];
                    null != O && (!L || 0 > mxUtils.indexOf(q, n)) && c.setCellStyles(n, O, [e])
                }
            }
        } finally {
            c.getModel().endUpdate()
        }
    };
    c.addListener("cellsInserted", function (a, b) {
        z(b.getProperty("cells"))
    });
    c.connectionHandler.addListener(mxEvent.CONNECT, function (a, b) {
        var c = [b.getProperty("cell")];
        b.getProperty("terminalInserted") && c.push(b.getProperty("terminal"));
        z(c, !0)
    });
    this.createCurrentEdgeStyle = function () {
        var a = "edgeStyle\x3d" + (r.edgeStyle || "none") + ";";
        null != r.shape && (a += "shape\x3d" + r.shape + ";");
        null != r.curved && (a += "curved\x3d" + r.curved + ";");
        null != r.rounded && (a += "rounded\x3d" + r.rounded + ";");
        "elbowEdgeStyle" == r.edgeStyle && null != r.elbow && (a += "elbow\x3d" + r.elbow + ";");
        return null != r.html ? a + ("html\x3d" + r.html + ";") : a + "html\x3d1;"
    };
    c.connectionHandler.createEdgeState =
        mxUtils.bind(this, function (a) {
            a = this.createCurrentEdgeStyle();
            a = c.createEdge(null, null, null, null, null, a);
            return new mxCellState(c.view, a, c.getCellStyle(a))
        });
    this.addListener("styleChanged", mxUtils.bind(this, function (a, b) {
        var e = b.getProperty("cells"), d = !1, f = !1;
        if (0 < e.length)for (var g = 0; g < e.length && !(d = c.getModel().isVertex(e[g]) || d, (f = c.getModel().isEdge(e[g]) || f) && d); g++); else f = d = !0;
        for (var e = b.getProperty("keys"), l = b.getProperty("values"), g = 0; g < e.length; g++) {
            var k = 0 <= mxUtils.indexOf(y, e[g]);
            if (0 <=
                mxUtils.indexOf(q, e[g])) {
                if (f || 0 <= mxUtils.indexOf(s, e[g]))r[e[g]] = l[g]
            } else if (0 <= mxUtils.indexOf(p, e[g])) {
                if (d || k)u[e[g]] = l[g];
                if (f || k || 0 <= mxUtils.indexOf(s, e[g]))r[e[g]] = l[g]
            }
        }
        null != this.toolbar && (this.toolbar.fontMenu.innerHTML = mxUtils.htmlEntities(u.fontFamily || "Helvetica"), this.toolbar.sizeMenu.innerHTML = mxUtils.htmlEntities(String(u.fontSize || "12")), this.toolbar.edgeStyleMenu.getElementsByTagName("div")[0].className = "arrow" == r.shape ? "geSprite geSprite-arrow" : "link" == r.shape ? "geSprite geSprite-linkedge" :
            "orthogonalEdgeStyle" == r.edgeStyle && "1" == r.curved ? "geSprite geSprite-curved" : "straight" == r.edgeStyle || "none" == r.edgeStyle || null == r.edgeStyle ? "geSprite geSprite-straight" : "entityRelationEdgeStyle" == r.edgeStyle ? "geSprite geSprite-entity" : "geSprite geSprite-orthogonal")
    }));
    null != this.toolbar && (x = mxUtils.bind(this, function () {
        var a = u.fontFamily || "Helvetica", b = String(u.fontSize || "12"), e = c.getView().getState(c.getSelectionCell());
        null != e && (a = e.style[mxConstants.STYLE_FONTFAMILY] || a, b = e.style[mxConstants.STYLE_FONTSIZE] ||
            b, 10 < a.length && (a = a.substring(0, 8) + "..."));
        this.toolbar.fontMenu.innerHTML = a;
        this.toolbar.sizeMenu.innerHTML = b
    }), c.getSelectionModel().addListener(mxEvent.CHANGE, x), c.getModel().addListener(mxEvent.CHANGE, x));
    c.addListener(mxEvent.CELLS_ADDED, function (a, b) {
        var e = b.getProperty("cells"), d = b.getProperty("parent");
        c.getModel().isLayer(d) && !c.isCellVisible(d) && (null != e && 0 < e.length) && c.getModel().setVisible(d, !0)
    });
    mxEvent.addListener(window, "resize", mxUtils.bind(this, function () {
        window.setTimeout(mxUtils.bind(this,
            function () {
                this.refresh()
            }), 0)
    }));
    mxEvent.addListener(window, "orientationchange", mxUtils.bind(this, function () {
        this.refresh()
    }));
    mxClient.IS_IOS && !window.navigator.standalone && mxEvent.addListener(window, "scroll", mxUtils.bind(this, function () {
        window.scrollTo(0, 0)
    }));
    this.editor.addListener("resetGraphView", mxUtils.bind(this, function () {
        window.setTimeout(mxUtils.bind(this, function () {
            this.editor.resetScrollbars()
        }), 0)
    }));
    mxEvent.addListener(document, "keydown", mxUtils.bind(this, function (a) {
        !mxEvent.isConsumed(a) &&
            27 == a.keyCode && this.hideDialog()
    }));
    this.editor.resetGraph();
    this.init();
    this.open()
};
mxUtils.extend(EditorUi, mxEventSource);
EditorUi.prototype.splitSize = mxClient.IS_TOUCH || mxClient.IS_POINTER ? 12 : 8;
EditorUi.prototype.menubarHeight = 30;
EditorUi.prototype.formatWidth = 0;
EditorUi.prototype.toolbarHeight = 34;
EditorUi.prototype.footerHeight = 28;
EditorUi.prototype.sidebarFooterHeight = 34;
EditorUi.prototype.hsplitPosition = 204;
EditorUi.prototype.allowAnimation = !0;
EditorUi.prototype.init = function () {
    this.addUndoListener();
    this.addBeforeUnloadListener();
    this.editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function () {
        this.updateActionStates()
    }));
    this.updateActionStates();
    this.initClipboard();
    this.initCanvas()
};
EditorUi.prototype.initClipboard = function () {
    var a = this.actions.get("paste"), b = mxUtils.bind(this, function () {
        a.setEnabled(this.editor.graph.cellEditor.isContentEditing() || !mxClipboard.isEmpty())
    }), c = mxClipboard.cut;
    mxClipboard.cut = function (a) {
        a.cellEditor.isContentEditing() ? document.execCommand("cut") : c.apply(this, arguments);
        b()
    };
    var d = mxClipboard.copy;
    mxClipboard.copy = function (a) {
        a.cellEditor.isContentEditing() ? document.execCommand("copy") : d.apply(this, arguments);
        b()
    };
    var e = mxClipboard.paste;
    mxClipboard.paste =
        function (a) {
            a.cellEditor.isContentEditing() ? document.execCommand("paste") : e.apply(this, arguments);
            b()
        };
    var f = this.editor.graph.cellEditor.startEditing;
    this.editor.graph.cellEditor.startEditing = function () {
        f.apply(this, arguments);
        b()
    };
    var g = this.editor.graph.cellEditor.stopEditing;
    this.editor.graph.cellEditor.stopEditing = function (a, c) {
        g.apply(this, arguments);
        b()
    };
    b()
};
EditorUi.prototype.initCanvas = function () {
    var a = this.editor.graph, a = this.editor.graph;
    a.timerAutoScroll = !0;
    a.scrollTileSize = new mxRectangle(0, 0, 400, 400);
    a.getPagePadding = function () {
        return new mxPoint(Math.max(0, Math.round(a.container.offsetWidth - 34)), Math.max(0, Math.round(a.container.offsetHeight - 34)))
    };
    a.getPageSize = function () {
        return this.pageVisible ? new mxRectangle(0, 0, this.pageFormat.width * this.pageScale, this.pageFormat.height * this.pageScale) : this.scrollTileSize
    };
    a.getPageLayout = function () {
        var a =
            this.pageVisible ? this.getPageSize() : this.scrollTileSize, b = this.getGraphBounds();
        if (0 == b.width || 0 == b.height)return new mxRectangle(0, 0, 1, 1);
        var c = Math.ceil(b.x / this.view.scale - this.view.translate.x), d = Math.ceil(b.y / this.view.scale - this.view.translate.y), k = Math.floor(b.height / this.view.scale), m = Math.floor(c / a.width), n = Math.floor(d / a.height), b = Math.ceil((c + Math.floor(b.width / this.view.scale)) / a.width) - m, a = Math.ceil((d + k) / a.height) - n;
        return new mxRectangle(m, n, b, a)
    };
    a.view.getBackgroundPageBounds = function () {
        var a =
            this.graph.getPageLayout(), b = this.graph.getPageSize();
        return new mxRectangle(this.scale * (this.translate.x + a.x * b.width), this.scale * (this.translate.y + a.y * b.height), this.scale * a.width * b.width, this.scale * a.height * b.height)
    };
    var b = null;
    if (this.editor.chromeless)b = mxUtils.bind(this, function (b) {
        if (null != a.container) {
            var c = a.view.translate, d = a.view.scale, l = a.pageVisible ? a.view.getBackgroundPageBounds() : a.getGraphBounds(), k = l.width, m = l.height, n = a.container.scrollTop, p = a.container.scrollLeft, q = a.container.clientWidth -
                10, r = a.container.clientHeight - 10, u = b ? Math.max(0.3, Math.min(1, q / k * d)) : d;
            a.view.scaleAndTranslate(u, Math.max(0, (q - k / (b ? d : 1)) / 2 / d) - l.x / d + c.x, Math.max(0, (r - m / (b ? d : 1)) / 4 / d) - l.y / d + c.y);
            a.container.scrollTop = n;
            a.container.scrollLeft = p
        }
    }), mxEvent.addListener(window, "resize", mxUtils.bind(this, function () {
        b(!1)
    })), this.editor.addListener("resetGraphView", mxUtils.bind(this, function () {
        b(!0)
    })), a.getPreferredPageSize = function (a, b, c) {
        a = this.getPageLayout();
        b = this.getPageSize();
        c = this.view.scale;
        return new mxRectangle(0,
            0, a.width * b.width * c, a.height * b.height * c)
    }; else if (this.editor.extendCanvas) {
        a.getPreferredPageSize = function (a, b, c) {
            a = this.getPageLayout();
            b = this.getPageSize();
            return new mxRectangle(0, 0, a.width * b.width, a.height * b.height)
        };
        var c = a.view.validate;
        a.view.validate = function () {
            if (null != this.graph.container && mxUtils.hasScrollbars(this.graph.container)) {
                var a = this.graph.getPagePadding(), b = this.graph.getPageSize();
                this.translate.x = a.x / this.scale - (this.x0 || 0) * b.width;
                this.translate.y = a.y / this.scale - (this.y0 ||
                    0) * b.height
            }
            c.apply(this, arguments)
        };
        var d = a.sizeDidChange;
        a.sizeDidChange = function () {
            if (null != this.container && mxUtils.hasScrollbars(this.container)) {
                var b = this.getPageLayout(), c = this.getPagePadding(), g = this.getPageSize(), l = Math.ceil(2 * c.x / this.view.scale + b.width * g.width), k = Math.ceil(2 * c.y / this.view.scale + b.height * g.height), m = a.minimumGraphSize;
                if (null == m || m.width != l || m.height != k)a.minimumGraphSize = new mxRectangle(0, 0, l, k);
                l = c.x / this.view.scale - b.x * g.width;
                c = c.y / this.view.scale - b.y * g.height;
                !this.autoTranslate &&
                    (this.view.translate.x != l || this.view.translate.y != c) ? (this.autoTranslate = !0, this.view.x0 = b.x, this.view.y0 = b.y, b = a.view.translate.x, g = a.view.translate.y, a.view.setTranslate(l, c), a.container.scrollLeft += (l - b) * a.view.scale, a.container.scrollTop += (c - g) * a.view.scale, this.autoTranslate = !1) : d.apply(this, arguments)
            }
        }
    }
    mxEvent.addMouseWheelListener(function (c, d) {
        if (mxEvent.isAltDown(c) || a.panningHandler.isActive())d ? a.zoomIn() : a.zoomOut(), null != b && b(!1), mxEvent.consume(c)
    })
};
EditorUi.prototype.isSelectionAllowed = function (a) {
    return"SELECT" == mxEvent.getSource(a).nodeName || mxUtils.isAncestorNode(this.formatContainer, mxEvent.getSource(a))
};
EditorUi.prototype.addBeforeUnloadListener = function () {
    window.onbeforeunload = mxUtils.bind(this, function () {
        return this.onBeforeUnload()
    })
};
EditorUi.prototype.onBeforeUnload = function () {
    if (this.editor.modified)return mxResources.get("allChangesLost")
};
EditorUi.prototype.open = function () {
    try {
        null != window.opener && null != window.opener.openFile && window.opener.openFile.setConsumer(mxUtils.bind(this, function (a, c) {
            try {
                var d = mxUtils.parseXml(a);
                this.editor.setGraphXml(d.documentElement);
                this.editor.setModified(!1);
                this.editor.undoManager.clear();
                null != c && (this.editor.setFilename(c), this.updateDocumentTitle())
            } catch (e) {
                mxUtils.alert(mxResources.get("invalidOrMissingFile") + ": " + e.message)
            }
        }))
    } catch (a) {
    }
    this.editor.graph.view.validate();
    this.editor.graph.sizeDidChange();
    this.editor.fireEvent(new mxEventObject("resetGraphView"))
};
EditorUi.prototype.updateDocumentTitle = function () {
    var a = this.editor.getOrCreateFilename();
    null != this.editor.appName && (a += " - " + this.editor.appName);
    document.title = a
};
EditorUi.prototype.redo = function () {
    this.editor.graph.cellEditor.isContentEditing() ? document.execCommand("redo") : (this.editor.graph.stopEditing(!1), this.editor.undoManager.redo())
};
EditorUi.prototype.undo = function () {
    if (this.editor.graph.cellEditor.isContentEditing()) {
        var a = this.editor.graph.cellEditor.getCurrentValue();
        document.execCommand("undo");
        a == this.editor.graph.cellEditor.getCurrentValue() && this.editor.graph.stopEditing(!1)
    } else this.editor.graph.stopEditing(!1), this.editor.undoManager.undo()
};
EditorUi.prototype.canRedo = function () {
    return this.editor.graph.cellEditor.isContentEditing() || this.editor.undoManager.canRedo()
};
EditorUi.prototype.canUndo = function () {
    return this.editor.graph.cellEditor.isContentEditing() || this.editor.undoManager.canUndo()
};
EditorUi.prototype.getUrl = function (a) {
    a = null != a ? a : window.location.pathname;
    var b = 0 < a.indexOf("?") ? 1 : 0, c;
    for (c in urlParams)a = 0 == b ? a + "?" : a + "\x26", a += c + "\x3d" + urlParams[c], b++;
    return a
};
EditorUi.prototype.setBackgroundColor = function (a) {
    this.editor.graph.background = a;
    this.editor.updateGraphComponents();
    this.fireEvent(new mxEventObject("backgroundColorChanged"))
};
EditorUi.prototype.setPageFormat = function (a) {
    this.editor.graph.pageFormat = a;
    this.editor.graph.pageVisible ? (this.editor.updateGraphComponents(), this.editor.graph.view.validateBackground(), this.editor.graph.sizeDidChange()) : this.actions.get("pageView").funct();
    this.fireEvent(new mxEventObject("pageFormatChanged"))
};
EditorUi.prototype.addUndoListener = function () {
    var a = this.actions.get("undo"), b = this.actions.get("redo"), c = this.editor.undoManager, d = mxUtils.bind(this, function () {
        a.setEnabled(this.canUndo());
        b.setEnabled(this.canRedo())
    });
    c.addListener(mxEvent.ADD, d);
    c.addListener(mxEvent.UNDO, d);
    c.addListener(mxEvent.REDO, d);
    c.addListener(mxEvent.CLEAR, d);
    var e = this.editor.graph.cellEditor.startEditing;
    this.editor.graph.cellEditor.startEditing = function () {
        e.apply(this, arguments);
        d()
    };
    var f = this.editor.graph.cellEditor.stopEditing;
    this.editor.graph.cellEditor.stopEditing = function (a, b) {
        f.apply(this, arguments);
        d()
    };
    d()
};
EditorUi.prototype.updateActionStates = function () {
    var a = this.editor.graph, b = !a.isSelectionEmpty(), c = !1, d = !1, e = a.getSelectionCells();
    if (null != e)for (var f = 0; f < e.length; f++) {
        var g = e[f];
        a.getModel().isEdge(g) && (d = !0);
        a.getModel().isVertex(g) && (c = !0);
        if (d && c)break
    }
    e = "cut copy bold italic underline delete duplicate style backgroundColor borderColor toFront toBack lockUnlock editData".split(" ");
    for (f = 0; f < e.length; f++)this.actions.get(e[f]).setEnabled(b);
    this.actions.get("setAsDefaultStyle").setEnabled(1 == a.getSelectionCount());
    this.actions.get("switchDirection").setEnabled(!a.isSelectionEmpty());
    this.actions.get("curved").setEnabled(d);
    this.actions.get("rotation").setEnabled(c);
    this.actions.get("wordWrap").setEnabled(c);
    this.actions.get("autosize").setEnabled(c);
    this.actions.get("collapsible").setEnabled(c);
    this.actions.get("group").setEnabled(1 < a.getSelectionCount());
    this.actions.get("ungroup").setEnabled(1 == a.getSelectionCount() && 0 < a.getModel().getChildCount(a.getSelectionCell()));
    f = c && 1 == a.getSelectionCount();
    this.actions.get("removeFromGroup").setEnabled(f && a.getModel().isVertex(a.getModel().getParent(a.getSelectionCell())));
    e = ["alignment", "position", "spacing"];
    for (f = 0; f < e.length; f++)this.menus.get(e[f]).setEnabled(b);
    b = a.view.getState(a.getSelectionCell());
    this.menus.get("align").setEnabled(1 < a.getSelectionCount());
    this.menus.get("distribute").setEnabled(1 < a.getSelectionCount());
    this.menus.get("direction").setEnabled(c || d && null != b && a.isLoop(b));
    this.actions.get("home").setEnabled(null != a.view.currentRoot);
    this.actions.get("exitGroup").setEnabled(null != a.view.currentRoot);
    c = 1 == a.getSelectionCount() && a.isValidRoot(a.getSelectionCell());
    this.actions.get("enterGroup").setEnabled(c);
    this.actions.get("expand").setEnabled(c);
    this.actions.get("collapse").setEnabled(c);
    this.actions.get("editLink").setEnabled(1 == a.getSelectionCount());
    this.actions.get("openLink").setEnabled(1 == a.getSelectionCount() && null != a.getLinkForCell(a.getSelectionCell()));
    this.actions.get("guides").setEnabled(a.isEnabled());
    this.actions.get("grid").setEnabled(a.isEnabled())
};
EditorUi.prototype.refresh = function () {
    var a = mxClient.IS_IE && (null == document.documentMode || 5 == document.documentMode), b = this.container.clientWidth, c = this.container.clientHeight;
    this.container == document.body && (b = document.body.clientWidth || document.documentElement.clientWidth, c = a ? document.body.clientHeight || document.documentElement.clientHeight : document.documentElement.clientHeight);
    var d = 0;
    mxClient.IS_IOS && !window.navigator.standalone && window.innerHeight != document.documentElement.clientHeight && (d = document.documentElement.clientHeight -
        window.innerHeight, window.scrollTo(0, 0));
    var e = Math.max(0, Math.min(this.hsplitPosition, b - this.splitSize - 20)), f = 0;
    null != this.menubar && (this.menubarContainer.style.height = this.menubarHeight + "px", f += this.menubarHeight);
    null != this.toolbar && (this.toolbarContainer.style.top = this.menubarHeight + "px", this.toolbarContainer.style.height = this.toolbarHeight + "px", f += this.toolbarHeight);
    0 < f && !mxClient.IS_QUIRKS && (f += 1);
    var g = 0;
    if (null != this.sidebarFooterContainer) {
        var l = this.footerHeight + d, g = Math.max(0, Math.min(c -
            f - l, this.sidebarFooterHeight));
        this.sidebarFooterContainer.style.width = e + "px";
        this.sidebarFooterContainer.style.height = g + "px";
        this.sidebarFooterContainer.style.bottom = l + "px"
    }
    this.sidebarContainer.style.top = f + "px";
    this.sidebarContainer.style.width = e + "px";
    this.formatContainer.style.top = f + "px";
    this.formatContainer.style.width = this.formatWidth + "px";
    this.diagramContainer.style.left = null != this.hsplit.parentNode ? e + this.splitSize + "px" : "0px";
    this.diagramContainer.style.top = this.sidebarContainer.style.top;
    this.footerContainer.style.height = this.footerHeight + "px";
    this.hsplit.style.top = this.sidebarContainer.style.top;
    this.hsplit.style.bottom = this.footerHeight + d + "px";
    this.hsplit.style.left = e + "px";
    a ? (this.menubarContainer.style.width = b + "px", this.toolbarContainer.style.width = this.menubarContainer.style.width, a = Math.max(0, c - this.footerHeight - this.menubarHeight - this.toolbarHeight), this.sidebarContainer.style.height = a - g + "px", this.formatContainer.style.height = a + "px", this.diagramContainer.style.width = null != this.hsplit.parentNode ?
        Math.max(0, b - e - this.splitSize - this.formatWidth) + "px" : b + "px", b = Math.max(0, c - this.footerHeight - this.menubarHeight - this.toolbarHeight), this.diagramContainer.style.height = b + "px", this.footerContainer.style.width = this.menubarContainer.style.width, this.hsplit.style.height = b + "px") : (0 < this.footerHeight && (this.footerContainer.style.bottom = d + "px"), this.sidebarContainer.style.bottom = this.footerHeight + g + d + "px", this.formatContainer.style.bottom = this.footerHeight + d + "px", this.diagramContainer.style.bottom = this.footerHeight +
        d + "px");
    this.editor.graph.sizeDidChange()
};
EditorUi.prototype.createDivs = function () {
    this.menubarContainer = this.createDiv("geMenubarContainer");
    this.toolbarContainer = this.createDiv("geToolbarContainer");
    this.sidebarContainer = this.createDiv("geSidebarContainer");
    this.formatContainer = this.createDiv("geSidebarContainer");
    this.diagramContainer = this.createDiv("geDiagramContainer");
    this.footerContainer = this.createDiv("geFooterContainer");
    this.hsplit = this.createDiv("geHsplit");
    this.menubarContainer.style.top = "0px";
    this.menubarContainer.style.left =
        "0px";
    this.menubarContainer.style.right = "0px";
    this.toolbarContainer.style.left = "0px";
    this.toolbarContainer.style.right = "0px";
    this.sidebarContainer.style.left = "0px";
    this.formatContainer.style.right = "0px";
    this.diagramContainer.style.right = this.formatWidth + "px";
    this.footerContainer.style.left = "0px";
    this.footerContainer.style.right = "0px";
    this.footerContainer.style.bottom = "0px";
    this.footerContainer.style.zIndex = mxPopupMenu.prototype.zIndex;
    this.hsplit.style.width = this.splitSize + "px";
    if (this.sidebarFooterContainer =
        this.createSidebarFooterContainer())this.sidebarFooterContainer.style.left = "0px"
};
EditorUi.prototype.createSidebarFooterContainer = function () {
    return null
};
EditorUi.prototype.createUi = function () {
    this.menubar = this.editor.chromeless ? null : this.menus.createMenubar(this.createDiv("geMenubar"));
    null != this.menubar && this.menubarContainer.appendChild(this.menubar.container);
    null != this.menubar && (this.statusContainer = this.createStatusContainer(), this.editor.addListener("statusChanged", mxUtils.bind(this, function () {
        this.setStatusText(this.editor.getStatus())
    })), this.setStatusText(this.editor.getStatus()), this.menubar.container.appendChild(this.statusContainer), this.container.appendChild(this.menubarContainer));
    this.toolbar = this.editor.chromeless ? null : this.createToolbar(this.createDiv("geToolbar"));
    null != this.toolbar && (this.toolbarContainer.appendChild(this.toolbar.container), this.container.appendChild(this.toolbarContainer));
    this.sidebar = this.editor.chromeless ? null : this.createSidebar(this.sidebarContainer);
    null != this.sidebar && this.container.appendChild(this.sidebarContainer);
    this.format = this.editor.chromeless ? null : this.createFormat(this.formatContainer);
    null != this.format && this.container.appendChild(this.formatContainer);
    var a = this.editor.chromeless ? null : this.createFooter();
    null != a && (this.footerContainer.appendChild(a), this.container.appendChild(this.footerContainer));
    null != this.sidebar && this.sidebarFooterContainer && this.container.appendChild(this.sidebarFooterContainer);
    this.container.appendChild(this.diagramContainer);
    null != this.sidebar && (this.container.appendChild(this.hsplit), this.addSplitHandler(this.hsplit, !0, 0, mxUtils.bind(this, function (a) {
        this.hsplitPosition = a;
        this.refresh()
    })))
};
EditorUi.prototype.createStatusContainer = function () {
    var a = document.createElement("a");
    a.className = "geItem geStatus";
    return a
};
EditorUi.prototype.setStatusText = function (a) {
    this.statusContainer.innerHTML = a
};
EditorUi.prototype.createToolbar = function (a) {
    return new Toolbar(this, a)
};
EditorUi.prototype.createSidebar = function (a) {
    return new Sidebar(this, a)
};
EditorUi.prototype.createFormat = function (a) {
    return new Format(this, a)
};
EditorUi.prototype.createFooter = function () {
    return this.createDiv("geFooter")
};
EditorUi.prototype.createDiv = function (a) {
    var b = document.createElement("div");
    b.className = a;
    return b
};
EditorUi.prototype.addSplitHandler = function (a, b, c, d) {
    function e(a) {
        null != f && (a = new mxPoint(mxEvent.getClientX(a), mxEvent.getClientY(a)), d(Math.max(0, g + (b ? a.x - f.x : f.y - a.y) - c)), g != m() && (l = !0, k = null))
    }

    var f = null, g = null, l = !0, k = null;
    mxClient.IS_POINTER && (a.style.msTouchAction = "none");
    var m = mxUtils.bind(this, function () {
        var e = parseInt(b ? a.style.left : a.style.bottom);
        b || (e = e + c - this.footerHeight);
        return e
    });
    mxEvent.addGestureListeners(a, function (a) {
        f = new mxPoint(mxEvent.getClientX(a), mxEvent.getClientY(a));
        g = m();
        l = !1;
        mxEvent.consume(a)
    });
    mxEvent.addListener(a, "click", function (a) {
        l || (a = null != k ? k - c : 0, k = m(), d(a))
    });
    mxEvent.addGestureListeners(document, null, e, function (a) {
        e(a);
        f = g = null
    })
};
EditorUi.prototype.showDialog = function (a, b, c, d, e, f) {
    this.editor.graph.tooltipHandler.hideTooltip();
    null == this.dialogs && (this.dialogs = []);
    this.dialog = new Dialog(this, a, b, c, d, e, f);
    this.dialogs.push(this.dialog)
};
EditorUi.prototype.hideDialog = function (a) {
    null != this.dialogs && 0 < this.dialogs.length && (this.dialogs.pop().close(a), this.dialog = 0 < this.dialogs.length ? this.dialogs[this.dialogs.length - 1] : null, null == this.dialog && "hidden" != this.editor.graph.container.style.visibility && this.editor.graph.container.focus(), this.editor.fireEvent(new mxEventObject("hideDialog")))
};
EditorUi.prototype.openFile = function () {
    window.openFile = new OpenFile(mxUtils.bind(this, function (a) {
        this.hideDialog(a)
    }));
    this.showDialog((new OpenDialog(this)).container, 360, 220, !0, !0, function () {
        window.openFile = null
    })
};
EditorUi.prototype.saveFile = function (a) {
    !a && null != this.editor.filename ? this.save(this.editor.getOrCreateFilename()) : (a = new FilenameDialog(this, this.editor.getOrCreateFilename(), mxResources.get("save"), mxUtils.bind(this, function (a) {
        this.save(a, !0)
    }), null, mxUtils.bind(this, function (a) {
        if (null != a && 0 < a.length)return!0;
        mxUtils.confirm(mxResources.get("invalidName"));
        return!1
    })), this.showDialog(a.container, 300, 100, !0, !0), a.init())
};
EditorUi.prototype.save = function (a) {
    if (null != a) {
        var b = mxUtils.getXml(this.editor.getGraphXml());
        try {
            if (useLocalStorage) {
                if (null != localStorage.getItem(a) && !mxUtils.confirm(mxResources.get("replace", [a])))return;
                localStorage.setItem(a, b);
                this.editor.setStatus(mxResources.get("saved") + " " + new Date)
            } else if (b.length < MAX_REQUEST_SIZE)b = encodeURIComponent(b), a = encodeURIComponent(a), (new mxXmlRequest(SAVE_URL, "filename\x3d" + a + "\x26xml\x3d" + b)).simulate(document, "_blank"); else {
                mxUtils.alert(mxResources.get("drawingTooLarge"));
                mxUtils.popup(b);
                return
            }
            this.editor.setModified(!1);
            this.editor.setFilename(a);
            this.updateDocumentTitle()
        } catch (c) {
            this.editor.setStatus("Error saving file")
        }
    }
};
EditorUi.prototype.executeLayout = function (a, b, c) {
    var d = this.editor.graph;
    if (d.isEnabled()) {
        d.getModel().beginUpdate();
        try {
            a()
        } catch (e) {
            throw e;
        } finally {
            this.allowAnimation && b && 0 > navigator.userAgent.indexOf("Camino") ? (a = new mxMorphing(d), a.addListener(mxEvent.DONE, mxUtils.bind(this, function () {
                d.getModel().endUpdate();
                null != c && c()
            })), a.startAnimation()) : d.getModel().endUpdate()
        }
    }
};
EditorUi.prototype.showImageDialog = function (a, b, c) {
    var d = this.editor.graph.cellEditor, e = d.saveSelection(), f = mxUtils.prompt(a, b);
    d.restoreSelection(e);
    if (null != f && 0 < f.length) {
        var g = new Image;
        g.onload = function () {
            c(f, g.width, g.height)
        };
        g.onerror = function () {
            mxUtils.alert(mxResources.get("fileNotFound"))
        };
        g.src = f
    }
};
EditorUi.prototype.showLinkDialog = function (a, b, c) {
    a = new LinkDialog(this, a, b, c);
    this.showDialog(a.container, 320, 90, !0, !0);
    a.init()
};
EditorUi.prototype.confirm = function (a, b, c) {
    mxUtils.confirm(a) ? null != b && b() : null != c && c()
};
EditorUi.prototype.createOutline = function (a) {
    var b = new mxOutline(this.editor.graph);
    b.border = 20;
    mxEvent.addListener(window, "resize", function () {
        b.update()
    });
    return b
};
EditorUi.prototype.createKeyHandler = function (a) {
    function b(a, b) {
        if (!c.isSelectionEmpty() && c.isEnabled()) {
            b = null != b ? b : 1;
            var e = 0, d = 0;
            37 == a ? e = -b : 38 == a ? d = -b : 39 == a ? e = b : 40 == a && (d = b);
            c.moveCells(c.getSelectionCells(), e, d);
            c.scrollCellToVisible(c.getSelectionCell())
        }
    }

    var c = this.editor.graph, d = new mxKeyHandler(c);
    d.isControlDown = function (a) {
        return mxEvent.isControlDown(a) || mxClient.IS_MAC && a.metaKey
    };
    d.bindAction = mxUtils.bind(this, function (a, b, c, e) {
        var m = this.actions.get(c);
        null != m && (c = function () {
            m.isEnabled() &&
            m.funct()
        }, b ? e ? d.bindControlShiftKey(a, c) : d.bindControlKey(a, c) : e ? d.bindShiftKey(a, c) : d.bindKey(a, c))
    });
    var e = d.escape;
    d.escape = function (a) {
        e.apply(this, arguments)
    };
    d.enter = function () {
    };
    d.bindControlKey(13, function () {
        c.foldCells(!1)
    });
    d.bindControlKey(8, function () {
        c.foldCells(!0)
    });
    d.bindKey(33, function () {
        c.exitGroup()
    });
    d.bindKey(34, function () {
        c.enterGroup()
    });
    d.bindKey(36, function () {
        c.home()
    });
    d.bindKey(35, function () {
        c.refresh()
    });
    d.bindKey(37, function () {
        b(37)
    });
    d.bindKey(38, function () {
        b(38)
    });
    d.bindKey(39, function () {
        b(39)
    });
    d.bindKey(40, function () {
        b(40)
    });
    d.bindShiftKey(37, function () {
        b(37, c.gridSize)
    });
    d.bindShiftKey(38, function () {
        b(38, c.gridSize)
    });
    d.bindShiftKey(39, function () {
        b(39, c.gridSize)
    });
    d.bindShiftKey(40, function () {
        b(40, c.gridSize)
    });
    d.bindAction(8, !1, "delete");
    d.bindAction(46, !1, "delete");
    d.bindAction(82, !0, "switchDirection");
    d.bindAction(83, !0, "save");
    d.bindAction(83, !0, "saveAs", !0);
    d.bindAction(107, !1, "zoomIn");
    d.bindAction(109, !1, "zoomOut");
    d.bindAction(65, !0, "selectAll");
    d.bindAction(65, !0, "selectVertices", !0);
    d.bindAction(69, !0, "selectEdges", !0);
    d.bindAction(69, !0, "style");
    d.bindAction(66, !0, "toBack");
    d.bindAction(70, !0, "toFront", !0);
    d.bindAction(68, !0, "duplicate");
    d.bindAction(68, !0, "setAsDefaultStyle", !0);
    d.bindAction(90, !0, "undo");
    d.bindAction(89, !0, "redo");
    d.bindAction(88, !0, "cut");
    d.bindAction(67, !0, "copy");
    d.bindAction(81, !0, "connectionPoints");
    d.bindAction(86, !0, "paste");
    d.bindAction(71, !0, "group");
    d.bindAction(77, !0, "editData");
    d.bindAction(71, !0, "grid",
        !0);
    d.bindAction(76, !0, "lockUnlock");
    d.bindAction(76, !0, "layers", !0);
    d.bindAction(79, !0, "outline", !0);
    d.bindAction(80, !0, "print");
    d.bindAction(85, !0, "ungroup");
    d.bindAction(112, !1, "about");
    d.bindKey(113, function () {
        c.startEditingAtCell()
    });
    return d
};