
/**
 * Parses URL parameters. Supported parameters are (precedence in given order):
 *
 * - lang=xy: Specifies the language of the user interface
 * - touch=1: Enables a touch-style user interface
 * - libs=key1;key2;...;keyN: Specifies the libraries
 * - picker=0: Disables Google picker
 * - picker=1: Enables Google picker
 * - clipboard=storage: Implements clipboard via local storage (default)
 * - clipboard=page: Do not use local storage for clipboard
 * - clipboard=system: Implements clipboard via system clipboard (experimental)
 * - storage=device: Adds device storage option for touch devices
 * - mode=google/dropobox/device/browser: Switch to given mode
 * - chrome=0: Chromeless read-only viewer with no analytics
 * - https=0: Disables/enables SSL
 * - flash=1: Enables Flash for saving
 * - math=0: Disables MathJax support
 * - gappid=1: Enables use of old App ID in DriveClient
 * - url=url: Opens diagram from URL (URL should be encoded)
 * - analytics=0: Disables Google Analytics
 * - plugins=0: Do not load Plugins
 * - gapi=0: Do not load Google APIs
 * - db=0: Do not load Dropbox APIs
 * - client=1: Runs in client mode. This will run a normal UI and send a "ready"
 *   message to the opener or parent when the page is loaded. After receiving
 *   a message with XML or compressed XML, a local file is created. The file is then
 *   set to modified so the connection to the window can be closed after sending the
 *   initial XML. The XML will not be loaded again after a refresh. The window will
 *   stay empty in this case.
 * - embed=1: Runs in embedded mode. This will send a "ready" message to the
 *   opener or parent when the page is loaded. After receiving the ready message
 *   the data can be sent as XML or compressed XML. It will send back XML or an empty
 *   string if apply or cancel are pressed, respectively.
 * - ui=atlas: Uses the atlas theme for the UI
 * - ready=message: The message to send in embed or client mode. Default is 'ready'.
 * - create=url/name: Creates new file from template URL. If the value is not an
 *   URL and is not empty the script will try to use window.opener[url]. In embed
 *   mode, window.opener[name] will be used to get the initial XML. Note that this
 *   needs same origin policy in the opener/parent for reading the variable.
 * - title=title: New file title (used with create)
 * - offline=1: Shortcut for db=0&gapi=0&math=0&picker=0&analytics=0
 *   and disables all remote operations and features, such as i18n (english only),
 *   remote images, google/dropbox integration, plugins and bitmap and PDF export.
 * - demo=1: Shortcut for db=0&gapi=0&math=0&picker=0&analytics=0, disables the
 *   splash screen and creates an empty, local file.
 * - pv=0: Sets default pageVisible to false.
 * - sb=0: Starts with scrollbars disabled.
 * --
 * - dev=1: For developers only
 * - test=1: For developers only
 * - drawdev=1: For developers only
 * - export=URL for export: For developers only
 * - ignoremime=1: For developers only (see DriveClient.js). Use Cmd-S to override mime.
 */
var urlParams = (function()
{
    var result = new Object();
    var params = window.location.search.slice(1).split('&');

    for (var i = 0; i < params.length; i++)
    {
        idx = params[i].indexOf('=');

        if (idx > 0)
        {
            result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
        }
    }

    return result;
})();

/**
 * Synchronously adds scripts to the page.
 */
function mxscript(src)
{
    document.write('<script src="'+src+'"></scr' + 'ipt>');
};

/**
 * Asynchronously adds scripts to the page.
 */
function mxinclude(src)
{
    var g = document.createElement('script'); g.type = 'text/javascript'; g.async = true; g.src = src;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(g, s);
};

// Checks for local storage and SVG support
var isSvgBrowser = navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 9;
var isLocalStorage = typeof(localStorage) != 'undefined';

// Redirect from rt.drive.io to drive.openossad.com
if (window.location.host == 'rt.openossad.com')
{
    window.location.host = 'drive.openossad.com';
}

var t0 = new Date();

// Public global variables
var MAX_REQUEST_SIZE = 10485760;
var MAX_AREA = 10000 * 10000;

// CUSTOM_PARAMETERS - URLs for save and export
var EXPORT_URL = 'http://openossad.localhost:9000/api/export';
var SHARE_HOST = 'http://www.openossad.com:8000';

var SAVE_URL = 'save';
var OPEN_URL = 'open';
var PROXY_URL = 'proxy';

// Paths and files
var STENCIL_PATH = 'stencils';
var SHAPES_PATH = 'shapes';
var IMAGE_PATH = 'images';
// Path for images inside the diagram
var GRAPH_IMAGE_PATH = 'img';
var ICONFINDER_PATH = 'iconfinder';
var STYLE_PATH = 'styles';
var CSS_PATH = 'styles';
var OPEN_FORM = 'open.html';
var TEMPLATE_PATH = '/templates';
var OPENOSSAD_TEMPLATE_PATH = '/openossad/templates';

// Directory for i18 files and basename for main i18n file
var RESOURCES_PATH = 'resources';
var RESOURCE_BASE = RESOURCES_PATH + '/dia';

// Specifies connection mode for touch devices (at least one should be true)
var tapAndHoldStartsConnection = true;
var showConnectorImg = true;

/**
 * Global function for loading local files via servlet
 */
function setCurrentXml(data, filename)
{
    if (window.parent != null && window.parent.openFile != null)
    {
        window.parent.openFile.setData(data, filename);
    }
};

/**
 * Returns the global language
 */
function getLanguage()
{
    var lang = (urlParams['offline'] == '1') ? 'en' : urlParams['lang'];

    // Known issue: No JSON object at this point in quirks in IE8
    if (lang == null && typeof(JSON) != 'undefined')
    {
        // Cannot use mxSettings here
        if (isLocalStorage)
        {
            try
            {
                var value = localStorage.getItem('.openossad-config');

                if (value != null)
                {
                    lang = JSON.parse(value).language || null;
                }
            }
            catch (e)
            {
                // cookies are disabled, attempts to use local storage will cause
                // a DOM error at a minimum on Chrome
                isLocalStorage = false;
            }
        }
    }

    return lang;
};

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// the special bundle.
var mxLoadResources = false;
var mxLanguage = getLanguage();

// Add new languages here. First entry is translated to [Automatic]
// in the menu defintion in Diagramly.js.
var mxLanguageMap = {'bs' : 'Bosanski', 'cs' : 'Čeština', 'da' : 'Dansk', 'de' : 'Deutsch', 'en' : 'English', 'es' : 'Español',
    'es-ar' : 'Español (Ar)', 'fr' : 'Français', 'id' : 'Indonesian', 'it' : 'Italiano', 'hu' : 'Magyar', 'nl' : 'Nederlands', 'no' : 'Norsk',
    'pl' : 'Polski', 'pt-br' : 'Português (Brasil)', 'pt' : 'Português (Portugal)', 'ro' : 'Română', 'fi' : 'Suomi', 'sv' : 'Svenska', 'tr' : 'Türkçe',
    'el' : 'Ελληνικά', 'ru' : 'Русский', 'sr' : 'Српски', 'uk' : 'Українська', 'th' : 'ไทย', 'ar' : 'العربية', 'zh' : '中文（中国）',  'zh-tw' : '中文（台灣）', 'ja' : '日本語', 'ko' : '한국어'};

var geBasePath = 'js';
var mxBasePath = 'mxgraph';
var ooBasePath = 'openossad';
var mxLanguages = [];

// Populates the list of supported special language bundles
for (var lang in mxLanguageMap)
{
    // Empty means default (ie. browser language), "en" means English (default for unsupported languages)
    // Since "en" uses no extension this must not be added to the array of supported language bundles.
    if (lang != 'en')
    {
        mxLanguages.push(lang);
    }
}

/**
 * Returns the global UI setting before runngin static draw.io code
 */
var uiTheme = (function()
{
    var ui = urlParams['ui'];

    // Known issue: No JSON object at this point in quirks in IE8
    if (ui == null && typeof(JSON) != 'undefined')
    {
        // Cannot use mxSettings here
        if (isLocalStorage)
        {
            try
            {
                var value = localStorage.getItem('.openossad-config');

                if (value != null)
                {
                    ui = JSON.parse(value).ui || null;
                }
            }
            catch (e)
            {
                // cookies are disabled, attempts to use local storage will cause
                // a DOM error at a minimum on Chrome
                isLocalStorage = false;
            }
        }
    }

    return ui;
})();

// Used to request grapheditor/mxgraph sources in dev mode
var mxDevUrl = document.location.protocol + '//devhost.openossad.com/mxgraph2';

// Used to request draw.io sources in dev mode
var drawDevUrl = '';

if (urlParams['drawdev'] == '1')
{
    drawDevUrl = document.location.protocol + '//drawhost.openossad.com/';
}

// Customizes export URL
var ex = urlParams['export'];

if (ex != null)
{
    EXPORT_URL = ex;
}

// Enables offline mode
if (urlParams['offline'] == '1' || urlParams['demo'] == '1')
{
    urlParams['analytics'] = '0';
    urlParams['picker'] = '0';
    urlParams['gapi'] = '0';
    urlParams['math'] = '0';
    urlParams['db'] = '0';
}

// Changes paths for local development environment
if (urlParams['dev'] == '1')
{
    geBasePath = geBasePath + '/' + mxBasePath;
//			mxBasePath = mxDevUrl + '/javascript/src';

    mxscript('/js/mxgraph/mxClient.js');

    // Adds external dependencies
    mxscript('js/spin/spin.min.js');
    mxscript('js/sharejs/socket.io.js');
    mxscript('js/sharejs/share.uncompressed.js');
    mxscript('js/sharejs/json.uncompressed.js');
    mxscript('js/deflate/rawdeflate.min.js');
    mxscript('js/deflate/rawinflate.min.js');
    mxscript('js/deflate/base64.js');
    mxscript('js/stately/Stately.js');
    mxscript('js/sanitizer/sanitizer.min.js');

    mxscript('js/openossad/EditorCompress.js');

    // Adds all JS code that depends on mxClient. This indirection via Devel.js is
    // required in some browsers to make sure mxClient.js (and the files that it
    // loads asynchronously) are available when the code loaded in Devel.js runs.
    mxscript('js/diagramly/Devel.js');
}
else
{
    mxscript('js/openossad.min.js');
}

// Loads gapi for all browsers but IE8 and below if not disabled or if enabled and in embed mode
if (((urlParams['embed'] != '1' && urlParams['gapi'] != '0') || (urlParams['embed'] == '1' && urlParams['gapi'] == '1')) && isSvgBrowser)
{
    mxscript('https://apis.google.com/js/api.js');
}

// Switches to dropbox mode for db.openossad.com
if (window.location.hostname == 'db.openossad.com' && urlParams['mode'] == null)
{
    urlParams['mode'] = 'dropbox';
}

// Loads dropbox for all browsers but IE8 and below (no CORS) if not disabled or if enabled and in embed mode
// KNOWN: Picker does not work in IE11 (https://dropbox.zendesk.com/requests/1650781)
if (((urlParams['embed'] != '1' && urlParams['db'] != '0') || (urlParams['embed'] == '1' && urlParams['db'] == '1')) && isSvgBrowser)
{
    mxscript('js/dropbox/dropbox.min.js');
}

// Loads JSON for older browsers
if (typeof(JSON) == 'undefined')
{
    mxscript('js/json/json2.min.js');
}

// Adds basic error handling
window.onerror = function()
{
    var status = document.getElementById('geStatus');

    if (status != null)
    {
        status.innerHTML = 'Page could not be loaded. Please try refreshing.';
    }
};