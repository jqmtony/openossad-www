var t0 = new Date();

		// Public global variables
		var MAX_REQUEST_SIZE = 10485760;
		var MAX_WIDTH = 6000;
		var MAX_HEIGHT = 6000;

		// CUSTOM_PARAMETERS - URLs for save and export
		var EXPORT_URL = 'http://exp.draw.io/ImageExport2/export';
		var SHARE_HOST = 'http://shr.diagramly.com:8000';

		var SAVE_URL = 'save';
		var OPEN_URL = 'open';

		// Paths and files
		var STENCIL_PATH = 'stencils';
		var IMAGE_PATH = 'images';
		// Path for images inside the diagram
		var GRAPH_IMAGE_PATH = 'img';
		var ICONFINDER_PATH = 'iconfinder';
		var STYLE_PATH = 'styles';
		var CSS_PATH = 'styles';
		var OPEN_FORM = 'open.html';
		var TEMPLATE_PATH = '/templates';

		// Directory for i18 files and basename for main i18n file
		var RESOURCES_PATH = 'resources';
		var RESOURCE_BASE = RESOURCES_PATH + '/dia';

		// Specifies connection mode for touch devices (at least one should be true)
		var tapAndHoldStartsConnection = true;
		var showConnectorImg = true;

		/**
		 * Parses URL parameters. Supported parameters are (precedence in given order):
		 *
		 * - lang=xy: Specifies the language of the user interface
		 * - touch=1: Enables a touch-style user interface
		 * - tmp=name: Loads /templates/name.xml
		 * - libs=key1;key2;...;keyN: Specifies the libraries
		 * - storage=local: Enables HTML5 local storage
		 * - picker=0: Disables the Google image picker
		 * - picker=1: Enables Google image picker without image upload
		 * - picker=2: Enables Google image picker with image upload
		 * - tiny=0: Do not use tinyMCE for HTML editing
		 * - tiny=1: Use the default config for tinyMCE
		 * - tiny=2: Use the IE config for tinyMCE
		 * - flash=1: Enables Flash for saving
		 * - aa=0: Disables anti aliasing
		 * - url=url: Opens diagram from URL (URL should be encoded)
		 * - share=ID of shared diagram
		 * - analytics=0: Disables Google Analytics
		 * - rotation=1: Enables rotation handle
		 * - gapi=0: Do not load Google APIs
		 * - rt=0: Do not start rt
		 * - load=0: Do not load XML file from Drive
		 * --
		 * - sharehost=URL for sharing: For developers only
		 * - export=URL for export: For developers only
		 * - test=1: For developers only
		 * - dev=1: For developers only
		 */
		var urlParams = (function(url)
		{
			var result = new Object();
			var idx = url.lastIndexOf('?');

			if (idx > 0)
			{
				var params = url.substring(idx + 1).split('&');

				for (var i = 0; i < params.length; i++)
				{
					idx = params[i].indexOf('=');

					if (idx > 0)
					{
						result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
					}
				}
			}

			return result;
		})(window.location.href);

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

		// Sets the base path, the UI language via URL param and configures the
		// supported languages to avoid 404s. The loading of all core language
		// resources is disabled as all required resources are in grapheditor.
		// properties. Note that in this example the loading of two resource
		// files (the special bundle and the default bundle) is disabled to
		// save a GET request. This requires that all resources be present in
		// the special bundle.
		var mxLoadResources = false;
		var mxLanguage = urlParams['lang'];
		var mxLanguages = ['ar', 'bs', 'cs', 'da', 'de', 'el', 'es', 'es-ar', 'fr', 'hu', 'id', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sr', 'sv', 'th', 'tr', 'uk', 'zh'];
		var geBasePath = 'js';
		var mxBasePath = 'mxgraph';

		// Used to request grapheditor/mxgraph sources in dev mode
		var mxDevUrl = 'http://draw.localhost/mxgraph';

		// Customizes sharing host
		var share = urlParams['sharehost'];

		if (share != null)
		{
			SHARE_HOST = share;
		}

		// Customizes export URL
		var ex = urlParams['export'];

		if (ex != null)
		{
			EXPORT_URL = ex;
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
			mxscript('js/deflate/rawdeflate.js');
			mxscript('js/deflate/base64.js');
			mxscript('js/stately/Stately.js');

			// Adds all JS code that depends on mxClient. This indirection via Devel.js is
			// required in some browsers to make sure mxClient.js (and the files that it
			// loads asynchronously) are available when the code loaded in Devel.js runs.
			mxscript('js/diagramly/Devel.js');
		}
		else
		{
			mxscript('js/diagramly.min.js');
		}

		// Loads gapi for all browsers but IE8 and below
		if(urlParams['gapi'] != '0' && (navigator.userAgent.indexOf('MSIE') == -1 || (document.documentMode != null && document.documentMode >= 9)))
		{
			mxscript('https://apis.google.com/js/api.js');
		}

		// Testing shapes
		if (urlParams['test'] == '1')
		{
			mxscript('js/diagramly/Test.js');
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
				status.innerHTML = 'Page could not be loaded';
			}
		};