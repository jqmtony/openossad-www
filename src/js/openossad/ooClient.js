/**
 * Created by xavi on 06/12/14.
 */
var ooClient = {VERSION: "0.2.0", IS_IE: 0 <= navigator.userAgent.indexOf("MSIE"), IS_IE6: 0 <= navigator.userAgent.indexOf("MSIE 6"), IS_IE11: !!navigator.userAgent.match(/Trident\/7\./), IS_QUIRKS: 0 <= navigator.userAgent.indexOf("MSIE") && (null == document.documentMode || 5 == document.documentMode), IS_EM: "spellcheck"in document.createElement("textarea") && 8 == document.documentMode, VML_PREFIX: "v", OFFICE_PREFIX: "o", IS_NS: 0 <= navigator.userAgent.indexOf("Mozilla/") && 0 > navigator.userAgent.indexOf("MSIE"), IS_OP: 0 <= navigator.userAgent.indexOf("Opera/"),
    IS_OT: 0 > navigator.userAgent.indexOf("Presto/2.4.") && 0 > navigator.userAgent.indexOf("Presto/2.3.") && 0 > navigator.userAgent.indexOf("Presto/2.2.") && 0 > navigator.userAgent.indexOf("Presto/2.1.") && 0 > navigator.userAgent.indexOf("Presto/2.0.") && 0 > navigator.userAgent.indexOf("Presto/1."), IS_SF: 0 <= navigator.userAgent.indexOf("AppleWebKit/") && 0 > navigator.userAgent.indexOf("Chrome/"), IS_IOS: navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1, IS_GC: 0 <= navigator.userAgent.indexOf("Chrome/"), IS_FF: 0 <= navigator.userAgent.indexOf("Firefox/"),
    IS_MT: 0 <= navigator.userAgent.indexOf("Firefox/") && 0 > navigator.userAgent.indexOf("Firefox/1.") && 0 > navigator.userAgent.indexOf("Firefox/2.") || 0 <= navigator.userAgent.indexOf("Iceweasel/") && 0 > navigator.userAgent.indexOf("Iceweasel/1.") && 0 > navigator.userAgent.indexOf("Iceweasel/2.") || 0 <= navigator.userAgent.indexOf("SeaMonkey/") && 0 > navigator.userAgent.indexOf("SeaMonkey/1.") || 0 <= navigator.userAgent.indexOf("Iceape/") && 0 > navigator.userAgent.indexOf("Iceape/1."), IS_SVG: 0 <= navigator.userAgent.indexOf("Firefox/") ||
        0 <= navigator.userAgent.indexOf("Iceweasel/") || 0 <= navigator.userAgent.indexOf("Seamonkey/") || 0 <= navigator.userAgent.indexOf("Iceape/") || 0 <= navigator.userAgent.indexOf("Galeon/") || 0 <= navigator.userAgent.indexOf("Epiphany/") || 0 <= navigator.userAgent.indexOf("AppleWebKit/") || 0 <= navigator.userAgent.indexOf("Gecko/") || 0 <= navigator.userAgent.indexOf("Opera/") || null != document.documentMode && 9 <= document.documentMode, NO_FO: !document.createElementNS || "[object SVGForeignObjectElement]" != document.createElementNS("http://www.w3.org/2000/svg",
        "foreignObject") || 0 <= navigator.userAgent.indexOf("Opera/"), IS_VML: "MICROSOFT INTERNET EXPLORER" == navigator.appName.toUpperCase(), IS_WIN: 0 < navigator.appVersion.indexOf("Win"), IS_MAC: 0 < navigator.appVersion.indexOf("Mac"), IS_TOUCH: "ontouchstart"in document.documentElement, IS_POINTER: null != window.navigator.msPointerEnabled ? window.navigator.msPointerEnabled : !1, IS_LOCAL: 0 > document.location.href.indexOf("http://") && 0 > document.location.href.indexOf("https://"), isBrowserSupported: function () {
        return ooClient.IS_VML ||
            ooClient.IS_SVG
    }, link: function (a, b, c) {
        c = c || document;
        if (ooClient.IS_IE6)c.write('\x3clink rel\x3d"' + a + '" href\x3d"' + b + '" charset\x3d"ISO-8859-1" type\x3d"text/css"/\x3e'); else {
            var d = c.createElement("link");
            d.setAttribute("rel", a);
            d.setAttribute("href", b);
            d.setAttribute("charset", "ISO-8859-1");
            d.setAttribute("type", "text/css");
            c.getElementsByTagName("head")[0].appendChild(d)
        }
    }, include: function (a) {
        document.write('\x3cscript src\x3d"' + a + '"\x3e\x3c/script\x3e')
    }, dispose: function () {
        for (var a = 0; a < mxEvent.objects.length; a++)null !=
            mxEvent.objects[a].mxListenerList && mxEvent.removeAllListeners(mxEvent.objects[a])
    }};
"undefined" == typeof mxLoadResources && (mxLoadResources = !0);
"undefined" == typeof mxResourceExtension && (mxResourceExtension = ".txt");
"undefined" == typeof mxLoadStylesheets && (mxLoadStylesheets = !0);
"undefined" != typeof mxBasePath && 0 < mxBasePath.length ? ("/" == mxBasePath.substring(mxBasePath.length - 1) && (mxBasePath = mxBasePath.substring(0, mxBasePath.length - 1)), ooClient.basePath = mxBasePath) : ooClient.basePath = ".";
"undefined" != typeof mxImageBasePath && 0 < mxImageBasePath.length ? ("/" == mxImageBasePath.substring(mxImageBasePath.length - 1) && (mxImageBasePath = mxImageBasePath.substring(0, mxImageBasePath.length - 1)), ooClient.imageBasePath = mxImageBasePath) : ooClient.imageBasePath = ooClient.basePath + "/images";
ooClient.language = "undefined" != typeof mxLanguage && null != mxLanguage ? mxLanguage : ooClient.IS_IE ? navigator.userLanguage : navigator.language;
ooClient.defaultLanguage = "undefined" != typeof mxDefaultLanguage && null != mxDefaultLanguage ? mxDefaultLanguage : "en";
mxLoadStylesheets && ooClient.link("stylesheet", ooClient.basePath + "/css/common.css");
"undefined" != typeof mxLanguages && null != mxLanguages && (ooClient.languages = mxLanguages);
ooClient.IS_VML && (ooClient.IS_SVG ? ooClient.IS_VML = !1 : (8 == document.documentMode ? (document.namespaces.add(ooClient.VML_PREFIX, "urn:schemas-microsoft-com:vml", "#default#VML"), document.namespaces.add(ooClient.OFFICE_PREFIX, "urn:schemas-microsoft-com:office:office", "#default#VML")) : (document.namespaces.add(ooClient.VML_PREFIX, "urn:schemas-microsoft-com:vml"), document.namespaces.add(ooClient.OFFICE_PREFIX, "urn:schemas-microsoft-com:office:office")), ooClient.IS_QUIRKS && 30 <= document.styleSheets.length ? function () {
    var a =
        document.createElement("style");
    a.type = "text/css";
    a.styleSheet.cssText = ooClient.VML_PREFIX + "\\:*{behavior:url(#default#VML)}" + ooClient.OFFICE_PREFIX + "\\:*{behavior:url(#default#VML)}";
    document.getElementsByTagName("head")[0].appendChild(a)
}() : document.createStyleSheet().cssText = ooClient.VML_PREFIX + "\\:*{behavior:url(#default#VML)}" + ooClient.OFFICE_PREFIX + "\\:*{behavior:url(#default#VML)}", mxLoadStylesheets && ooClient.link("stylesheet", ooClient.basePath + "/css/explorer.css"), window.attachEvent("onunload",
    ooClient.dispose)));