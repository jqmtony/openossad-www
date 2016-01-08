// Test to load bootstrap dialogs
function ExperimentBootstrapDialog(editorUi)
{
    var div = document.createElement('div');
    div.innerHTML = ''+
        '<div class="modal fade">'+
        '    <div class="modal-dialog">'+
        '        <div class="modal-content">'+
        '            <div class="modal-header">'+
        '                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
        '                <h4 class="modal-title">Modal title</h4>'+
        '            </div>'+
        '            <div class="modal-body">'+
        '                <p>One fine body&hellip;</p>'+
        '            </div>'+
        '            <div class="modal-footer">'+
        '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '                <button type="button" class="btn btn-primary">Save changes</button>'+
        '            </div>'+
        '        </div>'+
        '    </div>'+
        '</div>';

    mxUtils.br(div);
    div.appendChild(mxUtils.button(mxResources.get('close'), function()
    {
        editorUi.hideDialog();
    }));

    this.container = div;
};
function GraphPropertiesDialog(editorUi) {

    var data = { body: "Hello World!" };
    var templateName = 'first';

    var ext = 'tpl';
    var url = 'tpl/'+templateName; //req.toUrl(name).replace(/\.[^/.]+$/, '').replace(/^\.\//, '');

    var done = function(template){
        var html = template(data);
        var div = document.createElement('div');
        div.innerHTML = html;
        this.container = div;
        console.log('1');
    };

    waitsFor(
        $.get(url + '.' + ext, {}, function(response){
            waitsFor(
                done(function(data) {
                    data = data || {};
                    return Handlebars.compile(response)(data);
                    console.log('2');
                })
            );
        }, 'html')
    );

    console.log('3');

    return div;

}

function NewOpenossadDialog(editorUi, b) {
    //editorUi.mode == App.MODE_BROWSER;
    function c() {
        var b = input.value;
        null != b && 0 < b.length && editorUi.createFile(b, p, null != n && 0 <
            n.length ? n : null, null, function () {
            editorUi.hideDialog()
        })

    }

    function d(a, b, c) {
        null != q && (q.style.backgroundColor = "transparent", q.style.border = "1px solid transparent");
        p = b;
        n = c;
        q = a;
        q.style.backgroundColor = "#e6eff8";
        q.style.border = "1px solid #ccd9ea"
    }

    function e(a, b, e, f, g) {
        var div = document.createElement("div");
        div.className = "geTemplate";
        div.style.height = v + "px";
        div.style.width = x + "px";
        null != f && 0 < f.length && div.setAttribute("title", f);
        if (null != a && 0 < a.length) {
            a.substring(0, a.length - 4);
            div.style.backgroundImage = "url(" + TEMPLATE_PATH + "/" + a.substring(0, a.length - 4) + ".png)";
            div.style.backgroundPosition = "center center";
            div.style.backgroundRepeat = "no-repeat";
            var k = false;
            mxEvent.addListener(div, "click", function (e) {
                r.setAttribute("disabled", "disabled");
                div.style.backgroundColor = "transparent";
                div.style.border = "1px solid transparent";
                mxUtils.get(TEMPLATE_PATH + "/" + a, mxUtils.bind(this, function (a) {
                    200 == a.getStatus() && (r.removeAttribute("disabled"), d(div, a.getText(), b), k && c())
                }))
            });
            mxEvent.addListener(div, "dblclick", function (a) {
                k = !0
            })
        } else div.innerHTML = '\x3ctable width\x3d"100%" height\x3d"100%"\x3e\x3ctr\x3e\x3ctd align\x3d"center" valign\x3d"middle"\x3e' +
            mxResources.get(e) + "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e", g && d(div), mxEvent.addListener(div, "click", function (a) {
            d(div)
        }), mxEvent.addListener(div, "dblclick", function (a) {
            c()
        });
        select.appendChild(div)
    }

    function f() {
        function a() {
            for (var c = true; b < z.length && (c || 0 != mxUtils.mod(b, 30));)c = z[b++], e(c.url, c.libs, c.title, c.tooltip, c.select), c = !1
        }

        1 < t ? (mxUtils.write(l, mxResources.get("templates") + ":"), l.appendChild(y)) : input.style.width = "440px";
        var b = 0;
        mxEvent.addListener(select, "scroll", function (b) {
            select.scrollTop + select.clientHeight >= select.scrollHeight &&
            (a(), mxEvent.consume(b))
        });
        for (var c in s) {
            var d = s[c], f = document.createElement("option");
            f.setAttribute("value", c);
            var g = mxResources.get(c);
            null == g && (g = c.substring(0, 1).toUpperCase() + c.substring(1));
            18 < g.length && (g = g.substring(0, 18) + "\x26hellip;");
            f.innerHTML = g + " (" + d.length + ")";
            y.appendChild(f)
        }
        mxEvent.addListener(y, "change", function (c) {
            select.scrollTop = 0;
            select.innerHTML = "";
            b = 0;
            z = s[y.value];
            a()
        });
        a()
    }

    var div = document.createElement("div");
    div.style.height = "100%";
    var l = document.createElement("div");
    l.style.whiteSpace = "nowrap";
    l.style.height = "46px";
    div.appendChild(l);
    var k = document.createElement("img");
    k.setAttribute("border", "0");
    k.setAttribute("align", "absmiddle");
    k.style.width = "40px";
    k.style.height = "40px";
    k.style.marginRight = "10px";
    k.style.paddingBottom = "4px";
    k.src = editorUi.mode == App.MODE_GOOGLE ? IMAGE_PATH + "/google-drive-logo.svg" :
        editorUi.mode == App.MODE_DROPBOX ? IMAGE_PATH + "/dropbox-logo.svg" :
            editorUi.mode == App.MODE_BROWSER ? IMAGE_PATH + "/osa_database.png" : IMAGE_PATH + "/osa_drive-harddisk.png";
    l.appendChild(k);
    mxUtils.write(l, (editorUi.mode ==
        App.MODE_GOOGLE || editorUi.mode == App.MODE_BROWSER ? mxResources.get("diagramName") : mxResources.get("filename")) + ":");
    k = "";
    editorUi.mode == App.MODE_GOOGLE ? k = editorUi.drive.extension : editorUi.mode == App.MODE_DROPBOX ? k = editorUi.dropbox.extension : editorUi.mode == App.MODE_DEVICE && (k = ".xml");

    var input = document.createElement("input");
    input.setAttribute("value", editorUi.defaultFilename + k);
    input.style.marginRight = "20px";
    input.style.marginLeft = "10px";
    input.style.width = "210px";
    this.init = function () {
        input.focus();
        mxClient.IS_FF || 5 <= document.documentMode || mxClient.IS_QUIRKS ? input.select() : document.execCommand("selectAll")
    };
    l.appendChild(input);
    var n = null, p = null, q = null, r = mxUtils.button(mxResources.get("create"), function () {
        c()
    });
    r.className = "geBtn gePrimaryBtn";
    var select = document.createElement("div");
    select.style.borderWidth = "1px 0px 1px 0px";
    select.style.borderColor = "#d3d3d3";
    select.style.borderStyle = "solid";
    select.style.marginTop = "6px";
    select.style.overflow = "auto";
    select.style.height = "340px";
    var v = 180, x = 180;
    var y = document.createElement("select");
    y.style.marginLeft = "10px";
    var s = {}, t = 1;
    s.basic = [
        {title: "blankDiagram", select: !0}
    ];
    var z = s.basic;
    if (!b) {
        div.appendChild(select);
        var D = false;
        mxUtils.get(TEMPLATE_PATH + "/index.xml", function (a) {
            if (!D) {
                D = true;
                for (a = a.getXml().documentElement.firstChild; null != a;) {
                    if ("undefined" !== typeof a.getAttribute) {
                        var b = a.getAttribute("url"), c = b.indexOf("/"), b = b.substring(0, c), c = s[b];
                        null == c && (t++, c = [], s[b] = c);
                        c.push({url: a.getAttribute("url"), libs: a.getAttribute("libs"), title: a.getAttribute("title"), tooltip: a.getAttribute("url")})
                    }
                    a = a.nextSibling
                }
                f()
            }
        })
    }
    mxEvent.addListener(input, "keyup", function (b) {
        13 == b.keyCode && (editorUi.hideDialog(), c())
    });
    k = document.createElement("div");
    k.style.marginTop = b ? "4px" : "16px";
    k.style.textAlign = "right";
    var B = mxUtils.button(mxResources.get("cancel"), function () {
        editorUi.hideDialog(true)
    });
    B.className = "geBtn";
    editorUi.editor.cancelFirst && k.appendChild(B);
    if (!b) {
        var A = mxUtils.button(mxResources.get("fromTemplateUrl"), function () {
            var b = new FilenameDialog(editorUi, "", mxResources.get("create"), function (b) {
                null != b && 0 < b.length && (b = editorUi.getUrl(window.location.pathname + "?mode\x3d" + editorUi.mode + "\x26title\x3d" + encodeURIComponent(input.value) + "\x26create\x3d" + encodeURIComponent(b)), null ==
                    editorUi.getCurrentFile() ? window.location.href = b : window.openWindow(b))
            }, mxResources.get("url"));
            editorUi.showDialog(b.container, 300, 80, !0, !0);
            b.init()
        });
        A.className = "geBtn";
        k.appendChild(A)
    }
    k.appendChild(r);
    editorUi.editor.cancelFirst || k.appendChild(B);
    div.appendChild(k);
    this.container = div
}


function FilenameDialog(editorUi, b, c, d, e, f) {
    var g, l, k = document.createElement("table"), m = document.createElement("tbody");
    k.style.marginTop = "8px";
    g = document.createElement("tr");
    l = document.createElement("td");
    l.style.fontSize = "10pt";
    l.style.width = "120px";
    mxUtils.write(l, (e || mxResources.get("filename")) + ":");
    g.appendChild(l);
    var n = document.createElement("input");
    n.setAttribute("value", b || "");
    n.style.width = "180px";
    this.init = function () {
        n.focus();
        mxClient.IS_FF || 5 <= document.documentMode || mxClient.IS_QUIRKS ?
            n.select() : document.execCommand("selectAll")
    };
    l = document.createElement("td");
    l.appendChild(n);
    g.appendChild(l);
    m.appendChild(g);
    g = document.createElement("tr");
    l = document.createElement("td");
    l.colSpan = 2;
    l.style.paddingTop = "20px";
    l.style.whiteSpace = "nowrap";
    l.setAttribute("align", "right");
    b = mxUtils.button(mxResources.get("cancel"), function () {
        editorUi.hideDialog()
    });
    b.className = "geBtn";
    editorUi.editor.cancelFirst && l.appendChild(b);
    var p = mxUtils.button(c, function () {
        if (null == f || f(n.value))editorUi.hideDialog(), d(n.value)
    });
    p.className = "geBtn gePrimaryBtn";
    mxEvent.addListener(n, "keyup", function (a) {
        13 == a.keyCode && p.click()
    });
    l.appendChild(p);
    editorUi.editor.cancelFirst || l.appendChild(b);
    g.appendChild(l);
    m.appendChild(g);
    m.appendChild(g);
    k.appendChild(m);
    this.container = k
}

function TextareaDialog(editorUi, b, c, d, e, f) {
    var g, l, k = document.createElement("table"), m = document.createElement("tbody");
    g = document.createElement("tr");
    l = document.createElement("td");
    l.style.fontSize = "10pt";
    l.style.width = "100px";
    mxUtils.write(l, b);
    g.appendChild(l);
    m.appendChild(g);
    g = document.createElement("tr");
    l = document.createElement("td");
    var n = document.createElement("textarea");
    mxUtils.write(n, c || "");
    n.style.width = "300px";
    n.style.height = "120px";
    this.textarea = n;
    this.init = function () {
        n.focus()
    };
    l = document.createElement("td");
    l.appendChild(n);
    g.appendChild(l);
    m.appendChild(g);
    g = document.createElement("tr");
    l = document.createElement("td");
    l.style.paddingTop = "14px";
    l.style.whiteSpace = "nowrap";
    l.setAttribute("align", "right");
    b = mxUtils.button(f || mxResources.get("cancel"),
        function () {
            editorUi.hideDialog();
            null != e && e()
        });
    b.className = "geBtn";
    editorUi.editor.cancelFirst && l.appendChild(b);
    null != d && (c = mxUtils.button(mxResources.get("apply"), function () {
        editorUi.hideDialog();
        d(n.value)
    }), c.className = "geBtn gePrimaryBtn", l.appendChild(c));
    editorUi.editor.cancelFirst || l.appendChild(b);
    g.appendChild(l);
    m.appendChild(g);
    k.appendChild(m);
    this.container = k
}

function EditFileDialog(editorUi) {
    var b = document.createElement("div");
    b.style.textAlign = "right";
    var c = document.createElement("textarea");
    c.style.width = "600px";
    c.style.height = "370px";
    c.style.marginBottom = "16px";
    c.value = mxUtils.getPrettyXml(editorUi.editor.getGraphXml());
    b.appendChild(c);
    fileSupport && (c.addEventListener("dragover", function (a) {
        a.stopPropagation();
        a.preventDefault()
    }, !1), c.addEventListener("drop", function (a) {
        a.stopPropagation();
        a.preventDefault();
        if (0 < a.dataTransfer.files.length) {
            a = a.dataTransfer.files[0];
            var b = new FileReader;
            b.onload = function (a) {
                c.value = a.target.result
            };
            b.readAsText(a)
        }
    }, !1));
    var d = mxUtils.button(mxResources.get("cancel"), function () {
        editorUi.hideDialog()
    });
    d.className = "geBtn";
    editorUi.editor.cancelFirst && b.appendChild(d);
    var e = document.createElement("select");
    e.style.width = "180px";
    e.className = "geBtn";
    var f = document.createElement("option");
    f.setAttribute("value", "replace");
    mxUtils.write(f, mxResources.get("replaceExistingDrawing"));
    e.appendChild(f);
    f = document.createElement("option");
    f.setAttribute("value", "new");
    mxUtils.write(f, mxResources.get("openInNewWindow"));
    e.appendChild(f);
    f = document.createElement("option");
    f.setAttribute("value", "import");
    mxUtils.write(f,
        mxResources.get("addToExistingDrawing"));
    e.appendChild(f);
    b.appendChild(e);
    f = mxUtils.button(mxResources.get("ok"), function () {
        var b = editorUi.editor.graph.zapGremlins(mxUtils.trim(c.value));
        if ("new" == e.value)window.openFile = new OpenFile(function () {
            editorUi.hideDialog();
            window.openFile = null
        }), window.openFile.setData(b, null), window.open(editorUi.getUrl()); else if ("replace" == e.value)try {
            var d = mxUtils.parseXml(b);
            editorUi.editor.setGraphXml(d.documentElement);
            editorUi.hideDialog()
        } catch (f) {
            mxUtils.alert(f.message)
        } else"import" == e.value &&
        (d = mxUtils.parseXml(b), b = new mxGraphModel, (new mxCodec(d)).decode(d.documentElement, b), d = b.getChildren(b.getChildAt(b.getRoot(), 0)), editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(d)), editorUi.hideDialog())
    });
    f.className = "geBtn gePrimaryBtn";
    b.appendChild(f);
    editorUi.editor.cancelFirst || b.appendChild(d);
    this.container = b
}

function ExportDialog (editorUi) {
    function b() {
        var a = p.value, b = a.lastIndexOf(".");
        p.value = 0 < b ? a.substring(0, b + 1) + q.value : a + "." + q.value;
        "xml" === q.value ? (v.setAttribute("disabled", "true"), x.setAttribute("disabled",
            "true"), y.setAttribute("disabled", "true")) : (v.removeAttribute("disabled"), x.removeAttribute("disabled"), y.removeAttribute("disabled"));
        "png" === q.value || "svg" === q.value ? u.removeAttribute("disabled") : u.setAttribute("disabled", "disabled")
    }

    function c() {
        v.style.backgroundColor = v.value * x.value > MAX_AREA || 0 >= v.value ? "red" : "";
        x.style.backgroundColor = v.value * x.value > MAX_AREA || 0 >= x.value ? "red" : ""
    }

    function d() {
        var a = Math.max(0, parseInt(y.value)) + 1, b = parseInt(v.value) / l, c = null;
        "" != r.value && r.value != mxConstants.NONE && !u.checked && (c = r.value);
        return e.getSvg(c, b, a)
    }

    var e = editorUi.editor.graph, f = e.getGraphBounds(), g = e.view.scale, l = Math.ceil(f.width / g), k = Math.ceil(f.height / g), m, g = document.createElement("table"), n = document.createElement("tbody"), f = document.createElement("tr");
    m = document.createElement("td");
    m.style.fontSize = "10pt";
    m.style.width = "100px";
    mxUtils.write(m, mxResources.get("filename") + ":");
    f.appendChild(m);
    var p = document.createElement("input");
    p.setAttribute("value", editorUi.editor.getOrCreateFilename());
    p.style.width =
        "180px";
    m = document.createElement("td");
    m.appendChild(p);
    f.appendChild(m);
    n.appendChild(f);
    f = document.createElement("tr");
    m = document.createElement("td");
    m.style.fontSize = "10pt";
    mxUtils.write(m, mxResources.get("format") + ":");
    f.appendChild(m);
    var q = document.createElement("select");
    q.style.width = "180px";
    m = document.createElement("option");
    m.setAttribute("value", "png");
    mxUtils.write(m, "PNG - Portable Network Graphics");
    q.appendChild(m);
    m = document.createElement("option");
    m.setAttribute("value", "gif");
    mxUtils.write(m,
        "GIF - Graphics Interchange Format");
    q.appendChild(m);
    m = document.createElement("option");
    m.setAttribute("value", "jpg");
    mxUtils.write(m, "JPG - JPEG File Interchange Format");
    q.appendChild(m);
    m = document.createElement("option");
    m.setAttribute("value", "pdf");
    mxUtils.write(m, "PDF - Portable Document Format");
    q.appendChild(m);
    m = document.createElement("option");
    m.setAttribute("value", "svg");
    mxUtils.write(m, "SVG - Scalable Vector Graphics");
    q.appendChild(m);
    ExportDialog.showXmlOption && (m = document.createElement("option"),
        m.setAttribute("value", "xml"), mxUtils.write(m, "XML - Extensible Markup Language"), q.appendChild(m));
    m = document.createElement("td");
    m.appendChild(q);
    f.appendChild(m);
    n.appendChild(f);
    f = document.createElement("tr");
    m = document.createElement("td");
    m.style.fontSize = "10pt";
    mxUtils.write(m, mxResources.get("backgroundColor") + ":");
    f.appendChild(m);
    var r = document.createElement("input");
    r.setAttribute("value", e.background || "#FFFFFF");
    r.style.width = "80px";
    var u = document.createElement("input");
    u.setAttribute("type",
        "checkbox");
    u.checked = null == e.background || e.background == mxConstants.NONE;
    m = document.createElement("td");
    m.appendChild(r);
    m.appendChild(u);
    mxUtils.write(m, mxResources.get("transparent"));
    f.appendChild(m);
    n.appendChild(f);
    f = document.createElement("tr");
    m = document.createElement("td");
    m.style.fontSize = "10pt";
    mxUtils.write(m, mxResources.get("width") + ":");
    f.appendChild(m);
    var v = document.createElement("input");
    v.setAttribute("value", l);
    v.style.width = "180px";
    m = document.createElement("td");
    m.appendChild(v);
    f.appendChild(m);
    n.appendChild(f);
    f = document.createElement("tr");
    m = document.createElement("td");
    m.style.fontSize = "10pt";
    mxUtils.write(m, mxResources.get("height") + ":");
    f.appendChild(m);
    var x = document.createElement("input");
    x.setAttribute("value", k);
    x.style.width = "180px";
    m = document.createElement("td");
    m.appendChild(x);
    f.appendChild(m);
    n.appendChild(f);
    f = document.createElement("tr");
    m = document.createElement("td");
    m.style.fontSize = "10pt";
    mxUtils.write(m, mxResources.get("borderWidth") + ":");
    f.appendChild(m);
    var y = document.createElement("input");
    y.setAttribute("value", l);
    y.style.width = "180px";
    y.value = "0";
    m = document.createElement("td");
    m.appendChild(y);
    f.appendChild(m);
    n.appendChild(f);
    g.appendChild(n);
    mxEvent.addListener(q, "change", b);
    b();
    mxEvent.addListener(v, "change", function () {
        x.value = 0 < l ? Math.ceil(parseInt(v.value) * k / l) : "0";
        c()
    });
    mxEvent.addListener(x, "change", function () {
        v.value = 0 < k ? Math.ceil(parseInt(x.value) * l / k) : "0";
        c()
    });
    var s = new mxImageExport, f = document.createElement("tr");
    m = document.createElement("td");
    m.setAttribute("align", "right");
    m.style.paddingTop = "24px";
    m.colSpan = 2;
    var t = mxUtils.button(mxResources.get("export"), mxUtils.bind(this, function () {
        if (0 >= parseInt(v.value) && 0 >= parseInt(x.value))mxUtils.alert(mxResources.get("drawingEmpty")); else {
            var b = q.value, c = encodeURIComponent(p.value);
            if ("xml" == b) {
                var f = encodeURIComponent(mxUtils.getXml(editorUi.editor.getGraphXml()));
                (new mxXmlRequest(SAVE_URL, "filename\x3d" + c + "\x26xml\x3d" + f)).simulate(document, "_blank")
            } else if ("svg" == b)f = mxUtils.getXml(d()), f.length <
                MAX_REQUEST_SIZE ? (f = encodeURIComponent(f), (new mxXmlRequest(SAVE_URL, "filename\x3d" + c + "\x26format\x3d" + b + "\x26xml\x3d" + f)).simulate(document, "_blank")) : (mxUtils.alert(mxResources.get("drawingTooLarge")), mxUtils.popup(f)); else {
                var g = 0, k = 0;
                if ("svg" == ExportDialog.imgExportFormat)f = d(), g = parseInt(f.getAttribute("width")), k = parseInt(f.getAttribute("height")); else {
                    var k = Math.max(0, parseInt(y.value)) + 1, m = parseInt(v.value) / l, n = e.getGraphBounds(), t = e.view.scale, g = mxUtils.createXmlDocument(), f = g.createElement("output");
                    g.appendChild(f);
                    g = new mxXmlCanvas2D(f);
                    g.translate(Math.floor((k / m - n.x) / t), Math.floor((k / m - n.y) / t));
                    g.scale(m / t);
                    s.drawState(e.getView().getState(e.model.root), g);
                    g = Math.ceil(n.width * m / t + 2 * k);
                    k = Math.ceil(n.height * m / t + 2 * k)
                }
                f = mxUtils.getXml(f);
                if (null != f && f.length <= MAX_REQUEST_SIZE && 0 < g && 0 < k && g * k < MAX_AREA) {
                    m = "";
                    if ("" != r.value && r.value != mxConstants.NONE && ("png" != b || !u.checked))m = "\x26bg\x3d" + r.value;
                    (new mxXmlRequest(EXPORT_URL, "filename\x3d" + c + "\x26format\x3d" + b + m + "\x26w\x3d" + g + "\x26h\x3d" + k + "\x26" +
                        ExportDialog.imgExportFormat + "\x3d" + encodeURIComponent(f))).simulate(document, "_blank")
                } else mxUtils.alert(mxResources.get("drawingTooLarge"))
            }
            editorUi.hideDialog()
        }
    }));
    t.className = "geBtn gePrimaryBtn";
    var z = mxUtils.button(mxResources.get("cancel"), function () {
        editorUi.hideDialog()
    });
    z.className = "geBtn";
    editorUi.editor.cancelFirst ? (m.appendChild(z), m.appendChild(t)) : (m.appendChild(t), m.appendChild(z));
    f.appendChild(m);
    n.appendChild(f);
    g.appendChild(n);
    this.container = g
};
ExportDialog.imgExportFormat = "xml";
ExportDialog.showXmlOption = true;

function ooPageSetupDialog(editorUi) {
    null == PageSetupDialog.formats && (PageSetupDialog.formats = [
        {key: "a3", title: "A3 (297 mm x 420 mm)", format: new mxRectangle(0, 0, 1169, 1652)},
        {key: "a4", title: "A4 (210 mm x 297 mm)", format: mxConstants.PAGE_FORMAT_A4_PORTRAIT},
        {key: "a5", title: "A5 (148 mm x 210 mm)", format: new mxRectangle(0, 0, 584, 826)},
        {key: "letter", title: 'US-Letter (8,5" x 11")', format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT},
        {key: "tabloid", title: "US-Tabloid (279 mm x 432 mm)", format: new mxRectangle(0, 0, 1100, 1700)},
        {key: "custom", title: mxResources.get("custom"), format: null}
    ]);
    var b = editorUi.editor.graph, c, d, e = document.createElement("table");
    e.style.width = "100%";
    e.style.height = "100%";
    var f = document.createElement("tbody");
    c = document.createElement("tr");
    d = document.createElement("td");
    d.style.fontSize = "10pt";
    mxUtils.write(d, mxResources.get("paperSize") + ":");
    c.appendChild(d);
    var g = document.createElement("input");
    g.setAttribute("name", "format");
    g.setAttribute("type", "radio");
    var l = document.createElement("input");
    l.setAttribute("name", "format");
    l.setAttribute("type", "radio");
    var k = document.createElement("tr");
    k.style.display = "none";
    var m = document.createElement("tr");
    m.style.display = "none";
    var n = document.createElement("select");
    d = false;
    for (var p = {}, q = 0; q < PageSetupDialog.formats.length; q++) {
        var r =
            PageSetupDialog.formats[q];
        p[r.key] = r;
        var u = document.createElement("option");
        u.setAttribute("value", r.key);
        mxUtils.write(u, r.title);
        n.appendChild(u);
        null != r.format ? b.pageFormat.width == r.format.width && b.pageFormat.height == r.format.height ? (u.setAttribute("selected", "selected"), g.setAttribute("checked", "checked"), g.defaultChecked = !0, k.style.display = "", d = !0) : b.pageFormat.width == r.format.height && b.pageFormat.height == r.format.width && (u.setAttribute("selected", "selected"), l.setAttribute("checked", "checked"),
            l.defaultChecked = !0, k.style.display = "", d = !0) : d || (u.setAttribute("selected", "selected"), m.style.display = "")
    }
    d = document.createElement("td");
    d.style.fontSize = "10pt";
    d.appendChild(n);
    c.appendChild(d);
    f.appendChild(c);
    k = document.createElement("tr");
    k.style.height = "60px";
    d = document.createElement("td");
    k.appendChild(d);
    d = document.createElement("td");
    d.style.fontSize = "10pt";
    d.appendChild(g);
    c = document.createElement("span");
    mxUtils.write(c, " " + mxResources.get("portrait"));
    d.appendChild(c);
    mxEvent.addListener(c,
        "click", function (a) {
            g.checked = true;
            mxEvent.consume(a)
        });
    l.style.marginLeft = "10px";
    d.appendChild(l);
    c = document.createElement("span");
    mxUtils.write(c, " " + mxResources.get("landscape"));
    d.appendChild(c);
    mxEvent.addListener(c, "click", function (a) {
        l.checked = true;
        mxEvent.consume(a)
    });
    k.appendChild(d);
    f.appendChild(k);
    c = document.createElement("tr");
    d = document.createElement("td");
    m.appendChild(d);
    d = document.createElement("td");
    d.style.fontSize = "10pt";
    var v = document.createElement("input");
    v.setAttribute("size",
        "6");
    v.setAttribute("value", b.pageFormat.width);
    d.appendChild(v);
    mxUtils.write(d, " x ");
    var x = document.createElement("input");
    x.setAttribute("size", "6");
    x.setAttribute("value", b.pageFormat.height);
    d.appendChild(x);
    mxUtils.write(d, " Pixel");
    m.appendChild(d);
    m.style.height = "60px";
    f.appendChild(m);
    c = function () {
        var a = p[n.value];
        null != a.format ? (v.value = a.format.width, x.value = a.format.height, m.style.display = "none", k.style.display = "") : (k.style.display = "none", m.style.display = "")
    };
    mxEvent.addListener(n, "change",
        c);
    c();
    c = document.createElement("tr");
    d = document.createElement("td");
    d.colSpan = 2;
    d.setAttribute("align", "right");
    b = mxUtils.button(mxResources.get("cancel"), function () {
        editorUi.hideDialog()
    });
    b.className = "geBtn";
    editorUi.editor.cancelFirst && d.appendChild(b);
    q = mxUtils.button(mxResources.get("apply"), function () {
        editorUi.hideDialog();
        var b = l.checked, c = p[n.value].format;
        null == c && (c = new mxRectangle(0, 0, parseInt(v.value), parseInt(x.value)));
        b && (c = new mxRectangle(0, 0, c.height, c.width));
        editorUi.setPageFormat(c)
    });
    q.className = "geBtn gePrimaryBtn";
    d.appendChild(q);
    editorUi.editor.cancelFirst || d.appendChild(b);
    c.appendChild(d);
    f.appendChild(c);
    f.appendChild(c);
    e.appendChild(f);
    this.container = e
}

function StorageDialog (editorUi, b) {
    function c(c, e, g) {
        var n = document.createElement("a"), p = document.createElement("img");
        p.src = c;
        p.setAttribute("border", "0");
        p.setAttribute("align", "absmiddle");
        p.style.width = "60px";
        p.style.height = "60px";
        p.style.paddingBottom = "4px";
        n.style.display = "inline-block";
        n.className = "geBaseButton";
        n.style.margin = "4px";
        n.style.whiteSpace = "nowrap";
        n.appendChild(p);
        mxUtils.br(n);
        mxUtils.write(n, e);
        d.appendChild(n);
        mxEvent.addListener(n, "click", function () {
            g == App.MODE_GOOGLE && "openossad.localhost" ==
                window.location.hostname ? window.location.hostname = "drive.openossad.com" : g == App.MODE_GOOGLE && editorUi.spinner.spin(document.body, mxResources.get("authorizing")) ? editorUi.drive.checkToken(mxUtils.bind(this, function () {
                editorUi.spinner.stop();
                editorUi.setMode(g, f.checked);
                b()
            })) : (editorUi.setMode(g, f.checked), b())
        })
    }

    var d = document.createElement("div");
    d.style.textAlign = "center";
    editorUi.addLanguageMenu(d);
    if (!editorUi.isOffline()) {
        var e = document.createElement("a");
        e.setAttribute("href", "https://support.openossad.com/display/DO/Selecting+Storage");
        e.setAttribute("title", mxResources.get("help"));
        e.setAttribute("target", "_blank");
        e.style.position = "absolute";
        e.style.fontSize = "11px";
        e.style.textDecoration = "none";
        e.style.cursor = "pointer";
        e.style.bottom = "22px";
        e.style.left = "20px";
        e.style.color = "gray";
        e.innerHTML = mxResources.get("needHelp");
        d.appendChild(e)
    }
    var f = document.createElement("input");
    f.setAttribute("type", "checkbox");
    e = document.createElement("p");
    e.style.fontSize = "16pt";
    e.style.padding = "0px";
    e.style.paddingTop = "10px";
    e.style.paddingBottom = "22px";
    e.style.margin = "0px";
    e.style.color = "gray";
    mxUtils.write(e, mxResources.get("saveDiagramsTo") + ":");
    d.appendChild(e);
    null != editorUi.drive && c(IMAGE_PATH + "/google-drive-logo.svg", mxResources.get("googleDrive"), App.MODE_GOOGLE);
    null != editorUi.dropbox && c(IMAGE_PATH + "/dropbox-logo.svg", mxResources.get("dropbox"), App.MODE_DROPBOX);
    (!mxClient.IS_IOS || "device" == urlParams.storage) && c(IMAGE_PATH + "/osa_drive-harddisk.png", mxResources.get("device"), App.MODE_DEVICE);
    isLocalStorage && c(IMAGE_PATH + "/osa_database.png", mxResources.get("browser"),
        App.MODE_BROWSER);
    e = document.createElement("p");
    e.style.paddingTop = "16px";
    e.appendChild(f);
    var g = document.createElement("span");
    mxUtils.write(g, " " + mxResources.get("rememberThisSetting"));
    e.appendChild(g);
    d.appendChild(e);
    mxEvent.addListener(g, "click", function (a) {
        f.checked = !f.checked;
        mxEvent.consume(a)
    });
    isSvgBrowser && null == editorUi.drive && "0" != urlParams.gapi && (e = document.createElement("p"), e.style.padding = "8px", e.style.fontSize = "9pt", e.innerHTML = '\x3ca style\x3d"background-color:#dcdcdc;padding:5px;color:black;text-decoration:none;" href\x3d"https://plus.google.com/u/0/+DrawIo1/posts/1HTrfsb5wDN" target\x3d"_blank"\x3e\x3cimg border\x3d"0" src\x3d"' +
        mxClient.imageBasePath + '/warning.gif" align\x3d"top"\x3e ' + mxResources.get("googleDriveMissing") + "\x3c/a\x3e", d.appendChild(e));
    this.container = d
}

function SplashDialog (editorUi) {
    var b = document.createElement("div");
    b.style.textAlign = "center";
    editorUi.addLanguageMenu(b);
    var c = null;
    editorUi.isOffline() || (c = document.createElement("a"), c.setAttribute("href", "https://support.openossad.com/display/DO/Selecting+Storage"), c.setAttribute("title", mxResources.get("help")), c.setAttribute("target", "_blank"), c.style.position = "absolute", c.style.fontSize =
        "11px", c.style.textDecoration = "none", c.style.cursor = "pointer", c.style.bottom = "22px", c.style.left = "20px", c.style.color = "gray", c.innerHTML = mxResources.get("needHelp"), b.appendChild(c));
    var d = document.createElement("p");
    d.style.fontSize = "16pt";
    d.style.padding = "0px";
    d.style.paddingTop = "2px";
    d.style.paddingBottom = "16px";
    d.style.margin = "0px";
    d.style.color = "gray";
    var e = document.createElement("img");
    e.setAttribute("border", "0");
    e.setAttribute("align", "absmiddle");
    e.style.width = "40px";
    e.style.height = "40px";
    e.style.marginRight = "12px";
    e.style.paddingBottom = "4px";


    e.src = IMAGE_PATH + "/osa_database.png";
    f = mxResources.get("browser")

    if (editorUi.mode == App.MODE_GOOGLE) {
        e.src = IMAGE_PATH + "/google-drive-logo.svg";
        f = mxResources.get("googleDrive");
        c.setAttribute("href", "https://support.openossad.com/display/DO/Using+draw.io+with+Google+Drive");
    }

    if (editorUi.mode == App.MODE_DROPBOX) {
        e.src = IMAGE_PATH + "/dropbox-logo.svg";
        f = mxResources.get("dropbox");
        c.setAttribute("href", "https://support.openossad.com/display/DO/Using+draw.io+with+Dropbox");
    }
    if (editorUi.mode == App.MODE_DEVICE) {
        e.src = IMAGE_PATH + "/osa_drive-harddisk.png";
        var f = mxResources.get("device");
    }

    d.appendChild(e);
    mxUtils.write(d, f);
    b.appendChild(d);

    c = document.createElement("button");
    c.className = "geBigButton";
    c.style.marginBottom = "8px";
    mxClient.IS_QUIRKS && (c.style.width = "340px");
    mxUtils.write(c, mxResources.get("createNewDiagram"));
    mxEvent.addListener(c, "click", function () {
        editorUi.hideDialog();
        editorUi.actions.get("newOpenOSSADGraph").funct()
    });
    b.appendChild(c);
    mxUtils.br(b);
    c = document.createElement("button");
    c.className = "geBigButton";
    c.style.marginBottom = "36px";
    mxClient.IS_QUIRKS && (c.style.width = "340px");
    mxUtils.write(c, mxResources.get("openExistingDiagram"));
    mxEvent.addListener(c, "click", function () {
        editorUi.actions.get("open").funct()
    });
    b.appendChild(c);
    d = "undefined";
    editorUi.mode == App.MODE_GOOGLE ? d = mxResources.get("googleDrive") : editorUi.mode == App.MODE_DROPBOX ? d = mxResources.get("dropbox") : editorUi.mode == App.MODE_DEVICE ? d = mxResources.get("device") : editorUi.mode == App.MODE_BROWSER && (d = mxResources.get("browser"));
    e = 0;
    null != editorUi.drive && e++;
    null != editorUi.dropbox &&
    e++;
    isLocalStorage && e++;
    mxClient.IS_IOS || e++;
    1 < e && (mxUtils.br(b), e = document.createElement("a"), e.setAttribute("href", "javascript:void(0)"), mxUtils.write(e, mxResources.get("notUsingService", [d])), mxEvent.addListener(e, "click", function () {
        editorUi.hideDialog();
        editorUi.clearMode();
        editorUi.showSplash(true)
    }), b.appendChild(e), mxUtils.br(b), d = null != editorUi.drive ? editorUi.drive.getUser() : null, editorUi.mode == App.MODE_GOOGLE && null != d && (c.style.marginBottom = "24px", e = document.createElement("a"), e.setAttribute("href", "javascript:void(0)"), e.style.display =
        "block", e.style.marginTop = "2px", mxUtils.write(e, mxResources.get("changeUser") + " (" + d.displayName + ")"), mxEvent.addListener(e, "click", function () {
        editorUi.hideDialog();
        editorUi.drive.clearUserId();
        editorUi.drive.setUser(null);
        gapi.auth.signOut();
        editorUi.setMode(App.MODE_GOOGLE);
        editorUi.hideDialog();
        editorUi.showSplash();
        editorUi.drive.authorize(!1, mxUtils.bind(this, mxUtils.bind(this, function () {
            editorUi.hideDialog();
            editorUi.showSplash()
        })), mxUtils.bind(this, function (b) {
            editorUi.handleError(b, null, function () {
                editorUi.hideDialog();
                editorUi.showSplash()
            })
        }))
    }), b.appendChild(e)));
    this.container =
        b
}

function ConfirmDialog(editorUi, b, c, d) {
    var e = document.createElement("div");
    e.style.textAlign = "center";
    var f = document.createElement("div");
    f.style.padding = "6px";
    f.style.overflow = "auto";
    f.style.maxHeight = "40px";
    mxClient.IS_QUIRKS && (f.style.height = "60px");
    mxUtils.write(f, b);
    e.appendChild(f);
    b = document.createElement("div");
    b.style.marginTop = "16px";
    b.style.textAlign = "right";
    f = mxUtils.button(mxResources.get("cancel"), function () {
        editorUi.hideDialog();
        null != d && d()
    });
    f.className = "geBtn";
    editorUi.editor.cancelFirst && b.appendChild(f);
    var g = mxUtils.button(mxResources.get("ok"), function () {
        editorUi.hideDialog();
        null != c && c()
    });
    b.appendChild(g);
    g.className = "geBtn gePrimaryBtn";
    editorUi.editor.cancelFirst || b.appendChild(f);
    e.appendChild(b);
    this.container = e
}

function ErrorDialog (editorUi, b, c, d, e, f, g, l) {
    var k = document.createElement("div");
    k.style.textAlign = "center";
    if (null != b) {
        var m = document.createElement("div");
        m.style.padding = "0px";
        m.style.margin = "0px";
        m.style.fontSize = "18px";
        m.style.paddingBottom = "16px";
        m.style.marginBottom = "16px";
        m.style.borderBottom =
            "1px solid #c0c0c0";
        m.style.color = "gray";
        mxUtils.write(m, b);
        k.appendChild(m)
    }
    b = document.createElement("div");
    b.style.padding = "6px";
    b.innerHTML = c;
    k.appendChild(b);
    c = document.createElement("div");
    c.style.marginTop = "16px";
    c.style.textAlign = "right";
    null != f && (b = mxUtils.button(mxResources.get("tryAgain"), function () {
        editorUi.hideDialog();
        f()
    }), b.className = "geBtn", c.appendChild(b), c.style.textAlign = "center");
    var n = mxUtils.button(d, function () {
        editorUi.hideDialog();
        null != e && e()
    });
    c.appendChild(n);
    null != g && (d = mxUtils.button(g,
        function () {
            editorUi.hideDialog();
            null != l && l()
        }), d.className = "geBtn gePrimaryBtn", c.appendChild(d));
    this.init = function () {
        n.focus()
    };
    k.appendChild(c);
    this.container = k
}








// Test to load bootstrap dialogs
function legacySample(editorUi)
{
    var div = document.createElement('div');

    // Defines the templates for NewDialog (see below)
    var templates = ['P2&libs=general'];

    for (var i = 0; i < templates.length; i++)
    {
        var img = document.createElement('img');
        img.style.margin = '10px';
        img.setAttribute('border', '0');
        var base = templates[i];
        var index = base.indexOf('&');

        if (index > 0)
        {
            base = base.substring(0, index);
        }

        img.setAttribute('src', OPENOSSAD_TEMPLATE_PATH + '/images/' + base + '.png');

        var href = editorUi.getUrl(window.location.pathname + '?tmpo=' + templates[i]);
        var link = document.createElement('a');
        link.setAttribute('href', 'javascript:void(0);');
        link.setAttribute('target', '_blank');
        link.appendChild(img);

        (function(url)
        {
            mxEvent.addListener(link, 'click', function(evt)
            {
                window.open(url);
                editorUi.hideDialog();
                mxEvent.consume(evt);
            });
        })(href);

        div.appendChild(link);
    }

    mxUtils.br(div);
    mxUtils.br(div);
    div.appendChild(mxUtils.button(mxResources.get('close'), function()
    {
        editorUi.hideDialog();
    }));

    this.container = div;
};