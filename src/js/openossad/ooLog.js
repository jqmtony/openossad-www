/**
 * Created by xavi on 06/12/14.
 */
var ooLog = {consoleName: "Console", TRACE: !1, DEBUG: !0, WARN: !0, buffer: "", init: function () {
    if (null == ooLog.window && null != document.body) {
        var a = ooLog.consoleName + " - mxGraph " + mxClient.VERSION, b = document.createElement("table");
        b.setAttribute("width", "100%");
        b.setAttribute("height", "100%");
        var c = document.createElement("tbody"), d = document.createElement("tr"), e = document.createElement("td");
        e.style.verticalAlign = "top";
        ooLog.textarea = document.createElement("textarea");
        ooLog.textarea.setAttribute("readOnly", "true");
        ooLog.textarea.style.height = "100%";
        ooLog.textarea.style.resize = "none";
        ooLog.textarea.value = ooLog.buffer;
        ooLog.textarea.style.width = mxClient.IS_NS && "BackCompat" != document.compatMode ? "99%" : "100%";
        e.appendChild(ooLog.textarea);
        d.appendChild(e);
        c.appendChild(d);
        d = document.createElement("tr");
        ooLog.td = document.createElement("td");
        ooLog.td.style.verticalAlign = "top";
        ooLog.td.setAttribute("height", "30px");
        d.appendChild(ooLog.td);
        c.appendChild(d);
        b.appendChild(c);
        ooLog.addButton("Info", function (a) {
            ooLog.info()
        });
        ooLog.addButton("DOM", function (a) {
            a = mxUtils.getInnerHtml(document.body);
            ooLog.debug(a)
        });
        ooLog.addButton("Trace", function (a) {
            ooLog.TRACE = !ooLog.TRACE;
            ooLog.TRACE ? ooLog.debug("Tracing enabled") : ooLog.debug("Tracing disabled")
        });
        ooLog.addButton("Copy", function (a) {
            try {
                mxUtils.copy(ooLog.textarea.value)
            } catch (b) {
                mxUtils.alert(b)
            }
        });
        ooLog.addButton("Show", function (a) {
            try {
                mxUtils.popup(ooLog.textarea.value)
            } catch (b) {
                mxUtils.alert(b)
            }
        });
        ooLog.addButton("Clear", function (a) {
            ooLog.textarea.value = ""
        });
        d = c = 0;
        "number" === typeof window.innerWidth ? (c = window.innerHeight, d = window.innerWidth) : (c = document.documentElement.clientHeight || document.body.clientHeight, d = document.body.clientWidth);
        ooLog.window = new mxWindow(a, b, Math.max(0, d - 320), Math.max(0, c - 210), 300, 160);
        ooLog.window.setMaximizable(true);
        ooLog.window.setScrollable(false);
        ooLog.window.setResizable(true);
        ooLog.window.setClosable(true);
        ooLog.window.destroyOnClose = false;
        if ((mxClient.IS_NS || mxClient.IS_IE) && !mxClient.IS_GC && !mxClient.IS_SF && "BackCompat" != document.compatMode ||
            11 == document.documentMode) {
            var f = ooLog.window.getElement(), a = function (a, b) {
                ooLog.textarea.style.height = Math.max(0, f.offsetHeight - 70) + "px"
            };
            ooLog.window.addListener(mxEvent.RESIZE_END, a);
            ooLog.window.addListener(mxEvent.MAXIMIZE, a);
            ooLog.window.addListener(mxEvent.NORMALIZE, a);
            ooLog.textarea.style.height = "92px"
        }
    }
}, info: function () {
    ooLog.writeln(mxUtils.toString(navigator))
}, addButton: function (a, b) {
    var c = document.createElement("button");
    mxUtils.write(c, a);
    mxEvent.addListener(c, "click", b);
    ooLog.td.appendChild(c)
},
    isVisible: function () {
        return null != ooLog.window ? ooLog.window.isVisible() : !1
    }, show: function () {
        ooLog.setVisible(true)
    }, setVisible: function (a) {
        null == ooLog.window && ooLog.init();
        null != ooLog.window && ooLog.window.setVisible(a)
    }, enter: function (a) {
        if (ooLog.TRACE)return ooLog.writeln("Entering " + a), (new Date).getTime()
    }, leave: function (a, b) {
        if (ooLog.TRACE) {
            var c = 0 != b ? " (" + ((new Date).getTime() - b) + " ms)" : "";
            ooLog.writeln("Leaving " + a + c)
        }
    }, debug: function () {
        ooLog.DEBUG && ooLog.writeln.apply(this, arguments)
    }, warn: function () {
        ooLog.WARN &&
        ooLog.writeln.apply(this, arguments)
    }, write: function () {
        for (var a = "", b = 0; b < arguments.length; b++)a += arguments[b], b < arguments.length - 1 && (a += " ");
        null != ooLog.textarea ? (ooLog.textarea.value += a, 0 <= navigator.userAgent.indexOf("Presto/2.5") && (ooLog.textarea.style.visibility = "hidden", ooLog.textarea.style.visibility = "visible"), ooLog.textarea.scrollTop = ooLog.textarea.scrollHeight) : ooLog.buffer += a
    }, writeln: function () {
        for (var a = "", b = 0; b < arguments.length; b++)a += arguments[b], b < arguments.length - 1 && (a += " ");
        ooLog.write(a +
            "\n")
    }}, mxObjectIdentity = {FIELD_NAME: "mxObjectId", counter: 0, get: function (a) {
    if ("object" == typeof a && null == a[mxObjectIdentity.FIELD_NAME]) {
        var b = mxUtils.getFunctionName(a.constructor);
        a[mxObjectIdentity.FIELD_NAME] = b + "#" + mxObjectIdentity.counter++
    }
    return a[mxObjectIdentity.FIELD_NAME]
}, clear: function (a) {
    "object" == typeof a && delete a[mxObjectIdentity.FIELD_NAME]
}};