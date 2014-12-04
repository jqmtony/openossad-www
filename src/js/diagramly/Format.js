/**
 * Created by xavi on 30/11/14.
 */

Format = function (a, b) {
    this.editorUi = a;
    this.container = b;
    this.init()
};
Format.prototype.defaultFonts = "Helvetica;Verdana;Times New Roman;Garamond;Comic Sans MS;Courier New;Georgia;Lucida Console;Tahoma".split(";");
Format.prototype.init = function () {
    var a = this.editorUi, b = a.editor.graph;
    this.customFonts = [];
    this.customFontSizes = [];
    this.update = mxUtils.bind(this, function (a, b) {
        this.container.innerHTML = "";
        this.refresh()
    });
    b.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
    a.editor.addListener("fileLoaded", this.update);
    this.refresh()
};
Format.prototype.refresh = function () {
    var a = this.editorUi, b = a.editor.graph;
    if (b.isSelectionEmpty()) {
        var c = document.createElement("div");
        c.style.borderBottom = "1px solid #c0c0c0";
        c.style.height = "28px";
        c.style.fontSize = "12px";
        c.style.width = "100%";
        c.style.color = "rgb(112, 112, 112)";
        c.style.fontWeight = "bold";
        c.style.textAlign = "center";
        c.style.marginTop = "8px";
        mxUtils.write(c, mxResources.get("diagram"));
        this.container.appendChild(c);
        c = c.cloneNode(false);
        c.style.textAlign = "left";
        c.style.fontWeight = "normal";
        c.style.color =
            "rgb(81, 81, 81)";
        this.container.appendChild(c)
    } else {
        c = document.createElement("div");
        c.style.borderBottom = "1px solid #c0c0c0";
        c.style.height = "28px";
        c.style.fontSIze = "12px";
        c.style.width = "100%";
        c.style.color = "rgb(112, 112, 112)";
        c.style.fontWeight = "bold";
        c.style.textAlign = "center";
        c.style.marginTop = "8px";
        mxUtils.write(c, mxResources.get("style"));
        this.container.appendChild(c);
        c = c.cloneNode(false);
        c.style.textAlign = "left";
        c.style.fontWeight = "normal";
        c.style.color = "rgb(81, 81, 81)";
        var d = b.view.getState(b.getSelectionCell()),
            e = this.container;
        (function (c) {
            e.appendChild(c);
            var g = document.createElement("input");
            g.style.marginLeft = "10px";
            g.setAttribute("type", "checkbox");
            "" != mxUtils.getValue(d.style, mxConstants.STYLE_FILLCOLOR, "") && (g.setAttribute("checked", "checked"), g.defaultChecked = !0);
            c.appendChild(g);
            var l = mxUtils.button(mxResources.get("color"), function (b) {
                a.actions.get("fillColor").funct()
            });
            l.style.position = "absolute";
            l.style.marginTop = "2px";
            l.style.right = "20px";
            l.style.display = g.checked ? "" : "none";
            mxEvent.addListener(g,
                "change", function (a) {
                    b.setCellStyles(mxConstants.STYLE_FILLCOLOR, g.checked ? "#ffffff" : "none");
                    l.style.display = g.checked ? "" : "none";
                    mxEvent.consume(a)
                });
            var k = document.createElement("span");
            k.style.marginLeft = "2px";
            k.style.lineHeight = "22px";
            mxUtils.write(k, mxResources.get("fillColor"));
            mxEvent.addListener(k, "click", function (a) {
                g.checked = !g.checked;
                b.setCellStyles(mxConstants.STYLE_FILLCOLOR, g.checked ? "#ffffff" : "none");
                l.style.display = g.checked ? "" : "none";
                mxEvent.consume(a)
            });
            c.appendChild(k);
            c.appendChild(l);
            return c
        })(c.cloneNode(false));
        (function (c) {
            e.appendChild(c);
            var g = document.createElement("input");
            g.style.marginLeft = "10px";
            g.setAttribute("type", "checkbox");
            "" != mxUtils.getValue(d.style, mxConstants.STYLE_GRADIENTCOLOR, "") && (g.setAttribute("checked", "checked"), g.defaultChecked = !0);
            c.appendChild(g);
            var l = mxUtils.button(mxResources.get("color"), function (b) {
                a.actions.get("gradientColor").funct()
            });
            l.style.position = "absolute";
            l.style.marginTop = "2px";
            l.style.right = "20px";
            l.style.display = g.checked ? "" : "none";
            mxEvent.addListener(g, "change", function (a) {
                b.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, g.checked ? "#ffffff" : null);
                l.style.display = g.checked ? "" : "none";
                mxEvent.consume(a)
            });
            var k = document.createElement("span");
            k.style.marginLeft = "2px";
            k.style.lineHeight = "22px";
            mxUtils.write(k, mxResources.get("gradient"));
            mxEvent.addListener(k, "click", function (a) {
                g.checked = !g.checked;
                b.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, g.checked ? "#ffffff" : null);
                l.style.display = g.checked ? "" : "none";
                mxEvent.consume(a)
            });
            c.appendChild(k);
            c.appendChild(l);
            return c
        })(c.cloneNode(false));
        (function (c) {
            e.appendChild(c);
            var g = document.createElement("input");
            g.style.marginLeft = "10px";
            g.setAttribute("type", "checkbox");
            "" != mxUtils.getValue(d.style, mxConstants.STYLE_STROKECOLOR, "") && (g.setAttribute("checked", "checked"), g.defaultChecked = !0);
            c.appendChild(g);
            var l = mxUtils.button(mxResources.get("color"), function (b) {
                a.actions.get("strokeColor").funct()
            });
            l.style.position = "absolute";
            l.style.marginTop = "2px";
            l.style.right = "20px";
            l.style.display =
                g.checked ? "" : "none";
            mxEvent.addListener(g, "change", function (a) {
                b.setCellStyles(mxConstants.STYLE_STROKECOLOR, g.checked ? "#000000" : "none");
                l.style.display = g.checked ? "" : "none";
                mxEvent.consume(a)
            });
            var k = document.createElement("span");
            k.style.marginLeft = "2px";
            k.style.lineHeight = "22px";
            mxUtils.write(k, mxResources.get("strokeColor"));
            mxEvent.addListener(k, "click", function (a) {
                g.checked = !g.checked;
                b.setCellStyles(mxConstants.STYLE_STROKECOLOR, g.checked ? "#000000" : "none");
                l.style.display = g.checked ? "" : "none";
                mxEvent.consume(a)
            });
            c.appendChild(k);
            c.appendChild(l);
            return c
        })(c.cloneNode(false));
        (function (a) {
            e.appendChild(a);
            var c = document.createElement("input");
            c.style.marginLeft = "10px";
            c.setAttribute("type", "checkbox");
            c.checked = "0" != mxUtils.getValue(d.style, mxConstants.STYLE_SHADOW, "0");
            a.appendChild(c);
            mxEvent.addListener(c, "change", function (a) {
                b.setCellStyles(mxConstants.STYLE_SHADOW, c.checked ? "1" : "0");
                mxEvent.consume(a)
            });
            var l = document.createElement("span");
            l.style.marginLeft = "2px";
            l.style.lineHeight =
                "22px";
            mxUtils.write(l, mxResources.get("shadow"));
            mxEvent.addListener(l, "click", function (a) {
                c.checked = !c.checked;
                b.setCellStyles(mxConstants.STYLE_SHADOW, c.checked ? "1" : "0");
                mxEvent.consume(a)
            });
            a.appendChild(l)
        })(c.cloneNode(false))
    }
};