/**
 * Created by xavi on 06/12/14.
 */
ooUtils = {
    errorResource: "none" != ooClient.language ? "error" : "", closeResource: "none" != ooClient.language ? "close" : "", errorImage: ooClient.imageBasePath + "/error.gif",
    removeCursors: function (a) {
    null != a.style && (a.style.cursor = "");
    a = a.childNodes;
    if (null != a)for (var b = a.length, c = 0; c < b; c += 1)ooUtils.removeCursors(a[c])
}, getCurrentStyle: function () {
    return ooClient.IS_IE ? function (a) {
        return null != a ? a.currentStyle : null
    } : function (a) {
        return null != a ? window.getComputedStyle(a, "") : null
    }
}(), setPrefixedStyle: function () {
    var a =
        null;
    ooClient.IS_OP && ooClient.IS_OT ? a = "O" : ooClient.IS_SF || ooClient.IS_GC ? a = "Webkit" : ooClient.IS_MT ? a = "Moz" : ooClient.IS_IE && 9 <= document.documentMode && 10 > document.documentMode && (a = "ms");
    return function (b, c, d) {
        b[c] = d;
        null != a && 0 < c.length && (c = a + c.substring(0, 1).toUpperCase() + c.substring(1), b[c] = d)
    }
}(), hasScrollbars: function (a) {
    a = ooUtils.getCurrentStyle(a);
    return null != a && ("scroll" == a.overflow || "auto" == a.overflow)
}, bind: function (a, b) {
    return function () {
        return b.apply(a, arguments)
    }
}, eval: function (a) {
    var b =
        null;
    if (0 <= a.indexOf("function"))try {
        eval("var _mxJavaScriptExpression\x3d" + a), b = _mxJavaScriptExpression, _mxJavaScriptExpression = null
    } catch (c) {
        ooLog.warn(c.message + " while evaluating " + a)
    } else try {
        b = eval(a)
    } catch (d) {
        ooLog.warn(d.message + " while evaluating " + a)
    }
    return b
}, findNode: function (a, b, c) {
    var d = a.getAttribute(b);
    if (null != d && d == c)return a;
    for (a = a.firstChild; null != a;) {
        d = ooUtils.findNode(a, b, c);
        if (null != d)return d;
        a = a.nextSibling
    }
    return null
}, findNodeByAttribute: function () {
    return 9 <= document.documentMode ?
        function (a, b, c) {
            var d = null;
            if (null != a)if (a.nodeType == ooConstants.NODETYPE_ELEMENT && a.getAttribute(b) == c)d = a; else for (a = a.firstChild; null != a && null == d;)d = ooUtils.findNodeByAttribute(a, b, c), a = a.nextSibling;
            return d
        } : ooClient.IS_IE ? function (a, b, c) {
        return null == a ? null : a.ownerDocument.selectSingleNode("//*[@" + b + "\x3d'" + c + "']")
    } : function (a, b, c) {
        return null == a ? null : a.ownerDocument.evaluate("//*[@" + b + "\x3d'" + c + "']", a.ownerDocument, null, XPathResult.ANY_TYPE, null).iterateNext()
    }
}(), getFunctionName: function (a) {
    var b =
        null;
    if (null != a)if (null != a.name)b = a.name; else {
        a = a.toString();
        for (b = 9; " " == a.charAt(b);)b++;
        var c = a.indexOf("(", b), b = a.substring(b, c)
    }
    return b
}, indexOf: function (a, b) {
    if (null != a && null != b)for (var c = 0; c < a.length; c++)if (a[c] == b)return c;
    return-1
}, remove: function (a, b) {
    var c = null;
    if ("object" == typeof b)for (var d = ooUtils.indexOf(b, a); 0 <= d;)b.splice(d, 1), c = a, d = ooUtils.indexOf(b, a);
    for (var e in b)b[e] == a && (delete b[e], c = a);
    return c
}, isNode: function (a, b, c, d) {
    return null != a && !isNaN(a.nodeType) && (null == b || a.nodeName.toLowerCase() ==
        b.toLowerCase()) ? null == c || a.getAttribute(c) == d : !1
}, isAncestorNode: function (a, b) {
    for (var c = b; null != c;) {
        if (c == a)return!0;
        c = c.parentNode
    }
    return!1
}, getChildNodes: function (a, b) {
    b = b || ooConstants.NODETYPE_ELEMENT;
    for (var c = [], d = a.firstChild; null != d;)d.nodeType == b && c.push(d), d = d.nextSibling;
    return c
}, importNode: function (a, b, c) {
    if (ooClient.IS_IE && (null == document.documentMode || 10 > document.documentMode))switch (b.nodeType) {
        case 1:
            var d = a.createElement(b.nodeName);
            if (b.attributes && 0 < b.attributes.length) {
                for (var e =
                    0; e < b.attributes.length; e++)d.setAttribute(b.attributes[e].nodeName, b.getAttribute(b.attributes[e].nodeName));
                if (c && b.childNodes && 0 < b.childNodes.length)for (e = 0; e < b.childNodes.length; e++)d.appendChild(ooUtils.importNode(a, b.childNodes[e], c))
            }
            return d;
        case 3:
        case 4:
        case 8:
            return a.createTextNode(b.value)
    } else return a.importNode(b, c)
}, createXmlDocument: function () {
    var a = null;
    document.implementation && document.implementation.createDocument ? a = document.implementation.createDocument("", "", null) : window.ActiveXObject &&
        (a = new ActiveXObject("Microsoft.XMLDOM"));
    return a
}, parseXml: function () {
    return window.DOMParser ? function (a) {
        return(new DOMParser).parseFromString(a, "text/xml")
    } : function (a) {
        var b = ooUtils.createXmlDocument();
        b.async = "false";
        b.loadXML(a);
        return b
    }
}(),extractDiagram: function () {

        function extracted(htmlDocument) {
            var elements = htmlDocument.getElementsByTagName('diagram');
            var innerHTML = elements[0].innerHTML;
            return  new EditorCompress().decompress(innerHTML);
        }

        var parseWithDOMParser = function (xml) {
            var htmlDocument = (new DOMParser).parseFromString(xml, "text/xml");
            return  extracted(htmlDocument);
        };
        var parseWithooUtils = function (xml) {
            var b = ooUtils.createXmlDocument();
            b.async = "false";
            b.loadXML(xml);
            return extracted(b)
        };
        return window.DOMParser ? parseWithDOMParser : parseWithooUtils

}(), clearSelection: function () {
        return document.selection ? function () {
            document.selection.empty()
        } : window.getSelection ? function () {
            window.getSelection().removeAllRanges()
        } : function () {
        }
}(), zapGremlins: function (a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            (32 <= d || 9 == d || 10 == d || 13 == d) && b.push(a.charAt(c))
        }
        return b.join("")
}, getPrettyXml: function (a, b, c) {
    var d = [];
    if (null != a)if (b = b || "  ", c = c || "", a.nodeType ==
        ooConstants.NODETYPE_TEXT)d.push(a.value); else {
        d.push(c + "\x3c" + a.nodeName);
        var e = a.attributes;
        if (null != e)for (var f = 0; f < e.length; f++) {
            var g = ooUtils.htmlEntities(e[f].value);
            d.push(" " + e[f].nodeName + '\x3d"' + g + '"')
        }
        e = a.firstChild;
        if (null != e) {
            for (d.push("\x3e\n"); null != e;)d.push(ooUtils.getPrettyXml(e, b, c + b)), e = e.nextSibling;
            d.push(c + "\x3c/" + a.nodeName + "\x3e\n")
        } else d.push("/\x3e\n")
    }
    return d.join("")
}, removeWhitespace: function (a, b) {
    for (var c = b ? a.previousSibling : a.nextSibling; null != c && c.nodeType == ooConstants.NODETYPE_TEXT;) {
        var d =
            b ? c.previousSibling : c.nextSibling, e = ooUtils.getTextContent(c);
        0 == ooUtils.trim(e).length && c.parentNode.removeChild(c);
        c = d
    }
}, htmlEntities: function (a, b) {
    a = (a || "").replace(/&/g, "\x26amp;");
    a = a.replace(/"/g, "\x26quot;");
    a = a.replace(/\'/g, "\x26#39;");
    a = a.replace(/</g, "\x26lt;");
    a = a.replace(/>/g, "\x26gt;");
    if (null == b || b)a = a.replace(/\n/g, "\x26#xa;");
    return a
}, isVml: function (a) {
    return null != a && "urn:schemas-microsoft-com:vml" == a.tagUrn
}, getXml: function (a, b) {
    var c = "";
    null != window.XMLSerializer ? c = (new XMLSerializer).serializeToString(a) :
        null != a.xml && (c = a.xml.replace(/\r\n\t[\t]*/g, "").replace(/>\r\n/g, "\x3e").replace(/\r\n/g, "\n"));
    return c.replace(/\n/g, b || "\x26#xa;")
}, getTextContent: function (a) {
    return void 0 !== a.innerText ? a.innerText : null != a ? a[void 0 === a.textContent ? "text" : "textContent"] : ""
}, setTextContent: function (a, b) {
    void 0 !== a.innerText ? a.innerText = b : a[void 0 === a.textContent ? "text" : "textContent"] = b
}, getInnerHtml: function () {
    return ooClient.IS_IE ? function (a) {
        return null != a ? a.innerHTML : ""
    } : function (a) {
        return null != a ? (new XMLSerializer).serializeToString(a) :
            ""
    }
}(), getOuterHtml: function () {
    return ooClient.IS_IE ? function (a) {
        if (null != a) {
            if (null != a.outerHTML)return a.outerHTML;
            var b = [];
            b.push("\x3c" + a.nodeName);
            var c = a.attributes;
            if (null != c)for (var d = 0; d < c.length; d++) {
                var e = c[d].value;
                null != e && 0 < e.length && (b.push(" "), b.push(c[d].nodeName), b.push('\x3d"'), b.push(e), b.push('"'))
            }
            0 == a.innerHTML.length ? b.push("/\x3e") : (b.push("\x3e"), b.push(a.innerHTML), b.push("\x3c/" + a.nodeName + "\x3e"));
            return b.join("")
        }
        return""
    } : function (a) {
        return null != a ? (new XMLSerializer).serializeToString(a) :
            ""
    }
}(), write: function (a, b) {
    var c = a.ownerDocument.createTextNode(b);
    null != a && a.appendChild(c);
    return c
}, writeln: function (a, b) {
    var c = a.ownerDocument.createTextNode(b);
    null != a && (a.appendChild(c), a.appendChild(document.createElement("br")));
    return c
}, br: function (a, b) {
    b = b || 1;
    for (var c = null, d = 0; d < b; d++)null != a && (c = a.ownerDocument.createElement("br"), a.appendChild(c));
    return c
}, button: function (a, b, c) {
    c = null != c ? c : document;
    c = c.createElement("button");
    ooUtils.write(c, a);
    mxEvent.addListener(c, "click", function (a) {
        b(a)
    });
    return c
}, para: function (a, b) {
    var c = document.createElement("p");
    ooUtils.write(c, b);
    null != a && a.appendChild(c);
    return c
}, addTransparentBackgroundFilter: function (a) {
    a.style.filter += "progid:DXImageTransform.Microsoft.AlphaImageLoader(src\x3d'" + ooClient.imageBasePath + "/transparent.gif', sizingMethod\x3d'scale')"
}, linkAction: function (a, b, c, d, e) {
    return ooUtils.link(a, b, function () {
        c.execute(d)
    }, e)
}, linkInvoke: function (a, b, c, d, e, f) {
    return ooUtils.link(a, b, function () {
        c[d](e)
    }, f)
}, link: function (a, b, c, d) {
    var e =
        document.createElement("span");
    e.style.color = "blue";
    e.style.textDecoration = "underline";
    e.style.cursor = "pointer";
    null != d && (e.style.paddingLeft = d + "px");
    mxEvent.addListener(e, "click", c);
    ooUtils.write(e, b);
    null != a && a.appendChild(e);
    return e
}, fit: function (a) {
    var b = parseInt(a.offsetLeft), c = parseInt(a.offsetWidth), d = ooUtils.getDocumentScrollOrigin(a.ownerDocument), e = d.x, d = d.y, f = document.body, g = document.documentElement, l = e + (f.clientWidth || g.clientWidth);
    b + c > l && (a.style.left = Math.max(e, l - c) + "px");
    b = parseInt(a.offsetTop);
    c = parseInt(a.offsetHeight);
    f = d + Math.max(f.clientHeight || 0, g.clientHeight);
    b + c > f && (a.style.top = Math.max(d, f - c) + "px")
}, load: function (a) {
    a = new mxXmlRequest(a, null, "GET", !1);
    a.send();
    return a
}, get: function (a, b, c) {
    return(new mxXmlRequest(a, null, "GET")).send(b, c)
}, post: function (a, b, c, d) {
    return(new mxXmlRequest(a, b)).send(c, d)
}, submit: function (a, b, c, d) {
    return(new mxXmlRequest(a, b)).simulate(c, d)
}, loadInto: function (a, b, c) {
    ooClient.IS_IE ? b.onreadystatechange = function () {
        4 == b.readyState && c()
    } : b.addEventListener("load",
        c, !1);
    b.load(a)
}, getValue: function (a, b, c) {
    a = null != a ? a[b] : null;
    null == a && (a = c);
    return a
}, getNumber: function (a, b, c) {
    a = null != a ? a[b] : null;
    null == a && (a = c || 0);
    return Number(a)
}, getColor: function (a, b, c) {
    a = null != a ? a[b] : null;
    null == a ? a = c : a == ooConstants.NONE && (a = null);
    return a
}, clone: function (a, b, c) {
    c = null != c ? c : !1;
    var d = null;
    if (null != a && "function" == typeof a.constructor) {
        var d = new a.constructor, e;
        for (e in a)if (e != mxObjectIdentity.FIELD_NAME && (null == b || 0 > ooUtils.indexOf(b, e)))d[e] = !c && "object" == typeof a[e] ? ooUtils.clone(a[e]) :
            a[e]
    }
    return d
}, equalPoints: function (a, b) {
    if (null == a && null != b || null != a && null == b || null != a && null != b && a.length != b.length)return!1;
    if (null != a && null != b)for (var c = 0; c < a.length; c++)if (a[c] == b[c] || null != a[c] && !a[c].equals(b[c]))return!1;
    return!0
}, equalEntries: function (a, b) {
    if (null == a && null != b || null != a && null == b || null != a && null != b && a.length != b.length)return!1;
    if (null != a && null != b)for (var c in a)if ((!ooUtils.isNaN(a[c]) || !ooUtils.isNaN(b[c])) && a[c] != b[c])return!1;
    return!0
}, isNaN: function (a) {
    return"number" == typeof a &&
        isNaN(a)
}, extend: function (a, b) {
    var c = function () {
    };
    c.prototype = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
}, toString: function (a) {
    var b = "", c;
    for (c in a)try {
        if (null == a[c])b += c + " \x3d [null]\n"; else if ("function" == typeof a[c])b += c + " \x3d\x3e [Function]\n"; else if ("object" == typeof a[c])var d = ooUtils.getFunctionName(a[c].constructor), b = b + (c + " \x3d\x3e [" + d + "]\n"); else b += c + " \x3d " + a[c] + "\n"
    } catch (e) {
        b += c + "\x3d" + e.message
    }
    return b
}, toRadians: function (a) {
    return Math.PI * a / 180
}, arcToCurves: function (a, b, c, d, e, f, g, l, k) {
    l -= a;
    k -= b;
    if (0 === c || 0 === d)return q;
    c = Math.abs(c);
    d = Math.abs(d);
    var m = -l / 2, n = -k / 2, p = Math.cos(e * Math.PI / 180), q = Math.sin(e * Math.PI / 180);
    e = p * m + q * n;
    var m = -1 * q * m + p * n, n = e * e, r = m * m, u = c * c, v = d * d, x = n / u + r / v;
    1 < x ? (c *= Math.sqrt(x), d *= Math.sqrt(x), f = 0) : (x = 1, f === g && (x = -1), f = x * Math.sqrt((u * v - u * r - v * n) / (u * r + v * n)));
    n = f * c * m / d;
    r = -1 * f * d * e / c;
    l = p * n - q * r + l / 2;
    k = q * n + p * r + k / 2;
    u = Math.atan2((m - r) / d, (e - n) / c) - Math.atan2(0, 1);
    f = 0 <= u ? u : 2 * Math.PI + u;
    u = Math.atan2((-m - r) / d, (-e - n) / c) - Math.atan2((m - r) / d, (e - n) / c);
    e = 0 <= u ? u : 2 *
        Math.PI + u;
    0 == g && 0 < e ? e -= 2 * Math.PI : 0 != g && 0 > e && (e += 2 * Math.PI);
    g = 2 * e / Math.PI;
    g = Math.ceil(0 > g ? -1 * g : g);
    e /= g;
    m = 8 / 3 * Math.sin(e / 4) * Math.sin(e / 4) / Math.sin(e / 2);
    n = p * c;
    p *= d;
    c *= q;
    d *= q;
    for (var y = Math.cos(f), s = Math.sin(f), r = -m * (n * s + d * y), u = -m * (c * s - p * y), q = [], t = 0; t < g; ++t) {
        f += e;
        var y = Math.cos(f), s = Math.sin(f), v = n * y - d * s + l, x = c * y + p * s + k, z = -m * (n * s + d * y), y = -m * (c * s - p * y), s = 6 * t;
        q[s] = Number(r + a);
        q[s + 1] = Number(u + b);
        q[s + 2] = Number(v - z + a);
        q[s + 3] = Number(x - y + b);
        q[s + 4] = Number(v + a);
        q[s + 5] = Number(x + b);
        r = v + z;
        u = x + y
    }
    return q
}, getBoundingBox: function (a, b, c) {
    var d = null;
    if (null != a && null != b && 0 != b) {
        b = ooUtils.toRadians(b);
        var d = Math.cos(b), e = Math.sin(b);
        c = null != c ? c : new mxPoint(a.x + a.width / 2, a.y + a.height / 2);
        var f = new mxPoint(a.x, a.y);
        b = new mxPoint(a.x + a.width, a.y);
        var g = new mxPoint(b.x, a.y + a.height);
        a = new mxPoint(a.x, g.y);
        f = ooUtils.getRotatedPoint(f, d, e, c);
        b = ooUtils.getRotatedPoint(b, d, e, c);
        g = ooUtils.getRotatedPoint(g, d, e, c);
        a = ooUtils.getRotatedPoint(a, d, e, c);
        d = new mxRectangle(f.x, f.y, 0, 0);
        d.add(new mxRectangle(b.x, b.y, 0, 0));
        d.add(new mxRectangle(g.x,
            g.y, 0, 0));
        d.add(new mxRectangle(a.x, a.y, 0, 0))
    }
    return d
}, getRotatedPoint: function (a, b, c, d) {
    d = null != d ? d : new mxPoint;
    var e = a.x - d.x;
    a = a.y - d.y;
    return new mxPoint(e * b - a * c + d.x, a * b + e * c + d.y)
}, getPortConstraints: function (a, b, c, d) {
    b = ooUtils.getValue(a.style, ooConstants.STYLE_PORT_CONSTRAINT, null);
    if (null == b)return d;
    d = b.toString();
    b = ooConstants.DIRECTION_MASK_NONE;
    c = 0;
    1 == ooUtils.getValue(a.style, ooConstants.STYLE_PORT_CONSTRAINT_ROTATION, 0) && (c = ooUtils.getValue(a.style, ooConstants.STYLE_ROTATION, 0));
    a = 0;
    45 <
        c ? (a = 1, 135 <= c && (a = 2)) : -45 > c && (a = 3, -135 >= c && (a = 2));
    if (0 <= d.indexOf(ooConstants.DIRECTION_NORTH))switch (a) {
        case 0:
            b |= ooConstants.DIRECTION_MASK_NORTH;
            break;
        case 1:
            b |= ooConstants.DIRECTION_MASK_EAST;
            break;
        case 2:
            b |= ooConstants.DIRECTION_MASK_SOUTH;
            break;
        case 3:
            b |= ooConstants.DIRECTION_MASK_WEST
    }
    if (0 <= d.indexOf(ooConstants.DIRECTION_WEST))switch (a) {
        case 0:
            b |= ooConstants.DIRECTION_MASK_WEST;
            break;
        case 1:
            b |= ooConstants.DIRECTION_MASK_NORTH;
            break;
        case 2:
            b |= ooConstants.DIRECTION_MASK_EAST;
            break;
        case 3:
            b |=
                ooConstants.DIRECTION_MASK_SOUTH
    }
    if (0 <= d.indexOf(ooConstants.DIRECTION_SOUTH))switch (a) {
        case 0:
            b |= ooConstants.DIRECTION_MASK_SOUTH;
            break;
        case 1:
            b |= ooConstants.DIRECTION_MASK_WEST;
            break;
        case 2:
            b |= ooConstants.DIRECTION_MASK_NORTH;
            break;
        case 3:
            b |= ooConstants.DIRECTION_MASK_EAST
    }
    if (0 <= d.indexOf(ooConstants.DIRECTION_EAST))switch (a) {
        case 0:
            b |= ooConstants.DIRECTION_MASK_EAST;
            break;
        case 1:
            b |= ooConstants.DIRECTION_MASK_SOUTH;
            break;
        case 2:
            b |= ooConstants.DIRECTION_MASK_WEST;
            break;
        case 3:
            b |= ooConstants.DIRECTION_MASK_NORTH
    }
    return b
},
    reversePortConstraints: function (a) {
        var b = 0, b = (a & ooConstants.DIRECTION_MASK_WEST) << 3, b = b | (a & ooConstants.DIRECTION_MASK_NORTH) << 1, b = b | (a & ooConstants.DIRECTION_MASK_SOUTH) >> 1;
        return b | (a & ooConstants.DIRECTION_MASK_EAST) >> 3
    }, findNearestSegment: function (a, b, c) {
        var d = -1;
        if (0 < a.absolutePoints.length)for (var e = a.absolutePoints[0], f = null, g = 1; g < a.absolutePoints.length; g++) {
            var l = a.absolutePoints[g], e = ooUtils.ptSegDistSq(e.x, e.y, l.x, l.y, b, c);
            if (null == f || e < f)f = e, d = g - 1;
            e = l
        }
        return d
    }, rectangleIntersectsSegment: function (a, b, c) {
        var d = a.y, e = a.x, f = d + a.height, g = e + a.width;
        a = b.x;
        var l = c.x;
        b.x > c.x && (a = c.x, l = b.x);
        l > g && (l = g);
        a < e && (a = e);
        if (a > l)return!1;
        var e = b.y, g = c.y, k = c.x - b.x;
        1E-7 < Math.abs(k) && (c = (c.y - b.y) / k, b = b.y - c * b.x, e = c * a + b, g = c * l + b);
        e > g && (b = g, g = e, e = b);
        g > f && (g = f);
        e < d && (e = d);
        return e > g ? !1 : !0
    }, contains: function (a, b, c) {
        return a.x <= b && a.x + a.width >= b && a.y <= c && a.y + a.height >= c
    }, intersects: function (a, b) {
        var c = a.width, d = a.height, e = b.width, f = b.height;
        if (0 >= e || 0 >= f || 0 >= c || 0 >= d)return!1;
        var g = a.x, l = a.y, k = b.x, m = b.y, e = e + k, f = f + m, c = c +
            g, d = d + l;
        return(e < k || e > g) && (f < m || f > l) && (c < g || c > k) && (d < l || d > m)
    }, intersectsHotspot: function (a, b, c, d, e, f) {
        d = null != d ? d : 1;
        e = null != e ? e : 0;
        f = null != f ? f : 0;
        if (0 < d) {
            var g = a.getCenterX(), l = a.getCenterY(), k = a.width, m = a.height, n = ooUtils.getValue(a.style, ooConstants.STYLE_STARTSIZE) * a.view.scale;
            0 < n && (ooUtils.getValue(a.style, ooConstants.STYLE_HORIZONTAL, !0) ? (l = a.y + n / 2, m = n) : (g = a.x + n / 2, k = n));
            k = Math.max(e, k * d);
            m = Math.max(e, m * d);
            0 < f && (k = Math.min(k, f), m = Math.min(m, f));
            d = new mxRectangle(g - k / 2, l - m / 2, k, m);
            g = ooUtils.toRadians(ooUtils.getValue(a.style,
                ooConstants.STYLE_ROTATION) || 0);
            0 != g && (e = Math.cos(-g), f = Math.sin(-g), g = new mxPoint(a.getCenterX(), a.getCenterY()), a = ooUtils.getRotatedPoint(new mxPoint(b, c), e, f, g), b = a.x, c = a.y);
            return ooUtils.contains(d, b, c)
        }
        return!0
    }, getOffset: function (a, b) {
        var c = 0, d = 0;
        if (null != b && b)var e = ooUtils.getDocumentScrollOrigin(a.ownerDocument), c = c + e.x, d = d + e.y;
        for (; a.offsetParent;)c += a.offsetLeft, d += a.offsetTop, a = a.offsetParent;
        return new mxPoint(c, d)
    }, getDocumentScrollOrigin: function (a) {
        if (ooClient.IS_QUIRKS)return new mxPoint(a.body.scrollLeft,
            a.body.scrollTop);
        a = a.defaultView || a.parentWindow;
        return new mxPoint(null != a && void 0 !== window.pageXOffset ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft, null != a && void 0 !== window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop)
    }, getScrollOrigin: function (a) {
        for (var b = document.body, c = document.documentElement, d = ooUtils.getDocumentScrollOrigin(null != a ? a.ownerDocument : document); null != a && a != b &&
            a != c;)!isNaN(a.scrollLeft) && !isNaN(a.scrollTop) && (d.x += a.scrollLeft, d.y += a.scrollTop), a = a.parentNode;
        return d
    }, convertPoint: function (a, b, c) {
        var d = ooUtils.getScrollOrigin(a);
        a = ooUtils.getOffset(a);
        a.x -= d.x;
        a.y -= d.y;
        return new mxPoint(b - a.x, c - a.y)
    }, ltrim: function (a, b) {
        return a.replace(RegExp("^[" + (b || "\\s") + "]+", "g"), "")
    }, rtrim: function (a, b) {
        return a.replace(RegExp("[" + (b || "\\s") + "]+$", "g"), "")
    }, trim: function (a, b) {
        return ooUtils.ltrim(ooUtils.rtrim(a, b), b)
    }, isNumeric: function (a) {
        return!isNaN(parseFloat(a)) &&
            isFinite(a) && ("string" != typeof a || 0 > a.toLowerCase().indexOf("0x"))
    }, mod: function (a, b) {
        return(a % b + b) % b
    }, intersection: function (a, b, c, d, e, f, g, l) {
        var k = (l - f) * (c - a) - (g - e) * (d - b);
        g = ((g - e) * (b - f) - (l - f) * (a - e)) / k;
        e = ((c - a) * (b - f) - (d - b) * (a - e)) / k;
        return 0 <= g && 1 >= g && 0 <= e && 1 >= e ? new mxPoint(a + g * (c - a), b + g * (d - b)) : null
    }, ptSegDistSq: function (a, b, c, d, e, f) {
        c -= a;
        d -= b;
        e -= a;
        f -= b;
        0 >= e * c + f * d ? c = 0 : (e = c - e, f = d - f, a = e * c + f * d, c = 0 >= a ? 0 : a * a / (c * c + d * d));
        e = e * e + f * f - c;
        0 > e && (e = 0);
        return e
    }, relativeCcw: function (a, b, c, d, e, f) {
        c -= a;
        d -= b;
        e -= a;
        f -=
            b;
        a = e * d - f * c;
        0 == a && (a = e * c + f * d, 0 < a && (a = (e - c) * c + (f - d) * d, 0 > a && (a = 0)));
        return 0 > a ? -1 : 0 < a ? 1 : 0
    }, animateChanges: function (a, b) {
        mxEffects.animateChanges.apply(this, arguments)
    }, cascadeOpacity: function (a, b, c) {
        mxEffects.cascadeOpacity.apply(this, arguments)
    }, fadeOut: function (a, b, c, d, e, f) {
        mxEffects.fadeOut.apply(this, arguments)
    }, setOpacity: function (a, b) {
        ooUtils.isVml(a) ? a.style.filter = 100 <= b ? null : "alpha(opacity\x3d" + b / 5 + ")" : ooClient.IS_IE && ("undefined" === typeof document.documentMode || 9 > document.documentMode) ? a.style.filter =
            100 <= b ? null : "alpha(opacity\x3d" + b + ")" : a.style.opacity = b / 100
    }, createImage: function (a) {
        var b = null;
        ooClient.IS_IE6 && "CSS1Compat" != document.compatMode ? (b = document.createElement(ooClient.VML_PREFIX + ":image"), b.setAttribute("src", a), b.style.borderStyle = "none") : (b = document.createElement("img"), b.setAttribute("src", a), b.setAttribute("border", "0"));
        return b
    }, sortCells: function (a, b) {
        b = null != b ? b : !0;
        var c = new mxDictionary;
        a.sort(function (a, e) {
            var f = c.get(a);
            null == f && (f = mxCellPath.create(a).split(mxCellPath.PATH_SEPARATOR),
                c.put(a, f));
            var g = c.get(e);
            null == g && (g = mxCellPath.create(e).split(mxCellPath.PATH_SEPARATOR), c.put(e, g));
            f = mxCellPath.compare(f, g);
            return 0 == f ? 0 : 0 < f == b ? 1 : -1
        });
        return a
    }, getStylename: function (a) {
        return null != a && (a = a.split(";")[0], 0 > a.indexOf("\x3d")) ? a : ""
    }, getStylenames: function (a) {
        var b = [];
        if (null != a) {
            a = a.split(";");
            for (var c = 0; c < a.length; c++)0 > a[c].indexOf("\x3d") && b.push(a[c])
        }
        return b
    }, indexOfStylename: function (a, b) {
        if (null != a && null != b)for (var c = a.split(";"), d = 0, e = 0; e < c.length; e++) {
            if (c[e] == b)return d;
            d += c[e].length + 1
        }
        return-1
    }, addStylename: function (a, b) {
        0 > ooUtils.indexOfStylename(a, b) && (null == a ? a = "" : 0 < a.length && ";" != a.charAt(a.length - 1) && (a += ";"), a += b);
        return a
    }, removeStylename: function (a, b) {
        var c = [];
        if (null != a)for (var d = a.split(";"), e = 0; e < d.length; e++)d[e] != b && c.push(d[e]);
        return c.join(";")
    }, removeAllStylenames: function (a) {
        var b = [];
        if (null != a) {
            a = a.split(";");
            for (var c = 0; c < a.length; c++)0 <= a[c].indexOf("\x3d") && b.push(a[c])
        }
        return b.join(";")
    }, setCellStyles: function (a, b, c, d) {
        if (null != b && 0 < b.length) {
            a.beginUpdate();
            try {
                for (var e = 0; e < b.length; e++)if (null != b[e]) {
                    var f = ooUtils.setStyle(a.getStyle(b[e]), c, d);
                    a.setStyle(b[e], f)
                }
            } finally {
                a.endUpdate()
            }
        }
    }, setStyle: function (a, b, c) {
        var d = null != c && ("undefined" == typeof c.length || 0 < c.length);
        if (null == a || 0 == a.length)d && (a = b + "\x3d" + c); else {
            var e = a.indexOf(b + "\x3d");
            0 > e ? d && (d = ";" == a.charAt(a.length - 1) ? "" : ";", a = a + d + b + "\x3d" + c) : (b = d ? b + "\x3d" + c : "", c = a.indexOf(";", e), d || c++, a = a.substring(0, e) + b + (c > e ? a.substring(c) : ""))
        }
        return a
    }, setCellStyleFlags: function (a, b, c, d, e) {
        if (null !=
            b && 0 < b.length) {
            a.beginUpdate();
            try {
                for (var f = 0; f < b.length; f++)if (null != b[f]) {
                    var g = ooUtils.setStyleFlag(a.getStyle(b[f]), c, d, e);
                    a.setStyle(b[f], g)
                }
            } finally {
                a.endUpdate()
            }
        }
    }, setStyleFlag: function (a, b, c, d) {
        if (null == a || 0 == a.length)a = d || null == d ? b + "\x3d" + c : b + "\x3d0"; else {
            var e = a.indexOf(b + "\x3d");
            if (0 > e)e = ";" == a.charAt(a.length - 1) ? "" : ";", a = d || null == d ? a + e + b + "\x3d" + c : a + e + b + "\x3d0"; else {
                var f = a.indexOf(";", e), g = "", g = 0 > f ? a.substring(e + b.length + 1) : a.substring(e + b.length + 1, f), g = null == d ? parseInt(g) ^ c : d ? parseInt(g) |
                    c : parseInt(g) & ~c;
                a = a.substring(0, e) + b + "\x3d" + g + (0 <= f ? a.substring(f) : "")
            }
        }
        return a
    }, getAlignmentAsPoint: function (a, b) {
        var c = 0, d = 0;
        a == ooConstants.ALIGN_CENTER ? c = -0.5 : a == ooConstants.ALIGN_RIGHT && (c = -1);
        b == ooConstants.ALIGN_MIDDLE ? d = -0.5 : b == ooConstants.ALIGN_BOTTOM && (d = -1);
        return new mxPoint(c, d)
    }, getSizeForString: function (a, b, c, d) {
        b = null != b ? b : ooConstants.DEFAULT_FONTSIZE;
        c = null != c ? c : ooConstants.DEFAULT_FONTFAMILY;
        var e = document.createElement("div");
        e.style.fontFamily = c;
        e.style.fontSize = Math.round(b) +
            "px";
        e.style.lineHeight = Math.round(b * ooConstants.LINE_HEIGHT) + "px";
        e.style.position = "absolute";
        e.style.visibility = "hidden";
        e.style.display = ooClient.IS_QUIRKS ? "inline" : "inline-block";
        e.style.zoom = "1";
        null != d ? (e.style.width = d + "px", e.style.whiteSpace = "normal") : e.style.whiteSpace = "nowrap";
        e.innerHTML = a;
        document.body.appendChild(e);
        a = new mxRectangle(0, 0, e.offsetWidth, e.offsetHeight);
        document.body.removeChild(e);
        return a
    }, getViewXml: function (a, b, c, d, e) {
        d = null != d ? d : 0;
        e = null != e ? e : 0;
        b = null != b ? b : 1;
        null == c &&
        (c = [a.getModel().getRoot()]);
        var f = a.getView(), g = null, l = f.isEventsEnabled();
        f.setEventsEnabled(false);
        var k = f.drawPane, m = f.overlayPane;
        a.dialect == ooConstants.DIALECT_SVG ? (f.drawPane = document.createElementNS(ooConstants.NS_SVG, "g"), f.canvas.appendChild(f.drawPane), f.overlayPane = document.createElementNS(ooConstants.NS_SVG, "g")) : (f.drawPane = f.drawPane.cloneNode(false), f.canvas.appendChild(f.drawPane), f.overlayPane = f.overlayPane.cloneNode(false));
        f.canvas.appendChild(f.overlayPane);
        var n = f.getTranslate();
        f.translate =
            new mxPoint(d, e);
        b = new mxTemporaryCellStates(a.getView(), b, c);
        try {
            g = (new mxCodec).encode(a.getView())
        } finally {
            b.destroy(), f.translate = n, f.canvas.removeChild(f.drawPane), f.canvas.removeChild(f.overlayPane), f.drawPane = k, f.overlayPane = m, f.setEventsEnabled(l)
        }
        return g
    }, getScaleForPageCount: function (a, b, c, d) {
        if (1 > a)return 1;
        c = null != c ? c : ooConstants.PAGE_FORMAT_A4_PORTRAIT;
        d = null != d ? d : 0;
        var e = c.width - 2 * d;
        c = c.height - 2 * d;
        d = b.getGraphBounds().clone();
        b = b.getView().getScale();
        d.width /= b;
        d.height /= b;
        b = d.width;
        c = b / d.height / (e / c);
        d = Math.sqrt(a);
        var f = Math.sqrt(c);
        c = d * f;
        d /= f;
        if (1 > c && d > a) {
            var g = d / a;
            d = a;
            c /= g
        }
        1 > d && c > a && (g = c / a, c = a, d /= g);
        g = Math.ceil(c) * Math.ceil(d);
        for (f = 0; g > a;) {
            var g = Math.floor(c) / c, l = Math.floor(d) / d;
            1 == g && (g = Math.floor(c - 1) / c);
            1 == l && (l = Math.floor(d - 1) / d);
            g = g > l ? g : l;
            c *= g;
            d *= g;
            g = Math.ceil(c) * Math.ceil(d);
            f++;
            if (10 < f)break
        }
        return 0.99999 * (e * c / b)
    }, show: function (a, b, c, d, e, f) {
        c = null != c ? c : 0;
        d = null != d ? d : 0;
        null == b ? b = window.open().document : b.open();
        9 == document.documentMode && b.writeln('\x3c!--[if IE]\x3e\x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3d9"\x3e\x3c![endif]--\x3e');
        var g = a.getGraphBounds(), l = Math.ceil(c - g.x), k = Math.ceil(d - g.y);
        null == e && (e = Math.ceil(g.width + c) + Math.ceil(Math.ceil(g.x) - g.x));
        null == f && (f = Math.ceil(g.height + d) + Math.ceil(Math.ceil(g.y) - g.y));
        if (ooClient.IS_IE || 11 == document.documentMode) {
            d = "\x3chtml\x3e\x3chead\x3e";
            g = document.getElementsByTagName("base");
            for (c = 0; c < g.length; c++)d += g[c].outerHTML;
            d += "\x3cstyle\x3e";
            for (c = 0; c < document.styleSheets.length; c++)try {
                d += document.styleSheets(c).cssText
            } catch (m) {
            }
            d = d + '\x3c/style\x3e\x3c/head\x3e\x3cbody style\x3d"margin:0px;"\x3e' +
                ('\x3cdiv style\x3d"position:absolute;overflow:hidden;width:' + e + "px;height:" + f + 'px;"\x3e\x3cdiv style\x3d"position:relative;left:' + l + "px;top:" + k + 'px;"\x3e') + a.container.innerHTML;
            b.writeln(d + "\x3c/div\x3e\x3c/div\x3e\x3c/body\x3e\x3chtml\x3e");
            b.close()
        } else {
            b.writeln("\x3chtml\x3e\x3chead\x3e");
            g = document.getElementsByTagName("base");
            for (c = 0; c < g.length; c++)b.writeln(ooUtils.getOuterHtml(g[c]));
            d = document.getElementsByTagName("link");
            for (c = 0; c < d.length; c++)b.writeln(ooUtils.getOuterHtml(d[c]));
            d =
                document.getElementsByTagName("style");
            for (c = 0; c < d.length; c++)b.writeln(ooUtils.getOuterHtml(d[c]));
            b.writeln('\x3c/head\x3e\x3cbody style\x3d"margin:0px;"\x3e\x3c/body\x3e\x3c/html\x3e');
            b.close();
            c = b.createElement("div");
            c.position = "absolute";
            c.overflow = "hidden";
            c.style.width = e + "px";
            c.style.height = f + "px";
            e = b.createElement("div");
            e.style.position = "absolute";
            e.style.left = l + "px";
            e.style.top = k + "px";
            f = a.container.firstChild;
            for (d = null; null != f;)g = f.cloneNode(true), f == a.view.drawPane.ownerSVGElement ? (c.appendChild(g),
                d = g) : e.appendChild(g), f = f.nextSibling;
            b.body.appendChild(c);
            null != e.firstChild && b.body.appendChild(e);
            null != d && (d.style.minWidth = "", d.style.minHeight = "", d.firstChild.setAttribute("transform", "translate(" + l + "," + k + ")"))
        }
        ooUtils.removeCursors(b.body);
        return b
    }, printScreen: function (a) {
        var b = window.open();
        a.getGraphBounds();
        ooUtils.show(a, b.document);
        a = function () {
            b.focus();
            b.print();
            b.close()
        };
        ooClient.IS_GC ? b.setTimeout(a, 500) : a()
    }, popup: function (a, b) {
        if (b) {
            var c = document.createElement("div");
            c.style.overflow =
                "scroll";
            c.style.width = "636px";
            c.style.height = "460px";
            var d = document.createElement("pre");
            d.innerHTML = ooUtils.htmlEntities(a, !1).replace(/\n/g, "\x3cbr\x3e").replace(/ /g, "\x26nbsp;");
            c.appendChild(d);
            var d = document.body.clientWidth, e = Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight), c = new mxWindow("Popup Window", c, d / 2 - 320, e / 2 - 240, 640, 480, !1, !0);
            c.setClosable(true);
            c.setVisible(true)
        } else ooClient.IS_NS ? (c = window.open(), c.document.writeln("\x3cpre\x3e" + ooUtils.htmlEntities(a) +
            "\x3c/pre"), c.document.close()) : (c = window.open(), d = c.document.createElement("pre"), d.innerHTML = ooUtils.htmlEntities(a, !1).replace(/\n/g, "\x3cbr\x3e").replace(/ /g, "\x26nbsp;"), c.document.body.appendChild(d))
    }, alert: function (a) {
        alert(a)
    }, prompt: function (a, b) {
        return prompt(a, null != b ? b : "")
    }, confirm: function (a) {
        return confirm(a)
    }, error: function (a, b, c, d) {
        var e = document.createElement("div");
        e.style.padding = "20px";
        var f = document.createElement("img");
        f.setAttribute("src", d || ooUtils.errorImage);
        f.setAttribute("valign",
            "bottom");
        f.style.verticalAlign = "middle";
        e.appendChild(f);
        e.appendChild(document.createTextNode("\u00a0"));
        e.appendChild(document.createTextNode("\u00a0"));
        e.appendChild(document.createTextNode("\u00a0"));
        ooUtils.write(e, a);
        a = document.body.clientWidth;
        d = document.body.clientHeight || document.documentElement.clientHeight;
        var g = new mxWindow(mxResources.get(ooUtils.errorResource) || ooUtils.errorResource, e, (a - b) / 2, d / 4, b, null, !1, !0);
        c && (ooUtils.br(e), b = document.createElement("p"), c = document.createElement("button"),
            ooClient.IS_IE ? c.style.cssText = "float:right" : c.setAttribute("style", "float:right"), mxEvent.addListener(c, "click", function (a) {
            g.destroy()
        }), ooUtils.write(c, mxResources.get(ooUtils.closeResource) || ooUtils.closeResource), b.appendChild(c), e.appendChild(b), ooUtils.br(e), g.setClosable(true));
        g.setVisible(true);
        return g
    }, makeDraggable: function (a, b, c, d, e, f, g, l, k, m) {
        a = new mxDragSource(a, c);
        a.dragOffset = new mxPoint(null != e ? e : 0, null != f ? f : ooConstants.TOOLTIP_VERTICAL_OFFSET);
        a.autoscroll = g;
        a.setGuidesEnabled(false);
        null != k && (a.highlightDropTargets = k);
        null != m && (a.getDropTarget = m);
        a.getGraphForEvent = function (a) {
            return"function" == typeof b ? b(a) : b
        };
        null != d && (a.createDragElement = function () {
            return d.cloneNode(true)
        }, l && (a.createPreviewElement = function (a) {
            var b = d.cloneNode(true), c = parseInt(b.style.width), e = parseInt(b.style.height);
            b.style.width = Math.round(c * a.view.scale) + "px";
            b.style.height = Math.round(e * a.view.scale) + "px";
            return b
        }));
        return a
    }};