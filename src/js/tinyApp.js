if (typeof(tinyMCE) != 'undefined')
{
	if (mxClient.IS_IE || urlParams['tiny'] == '2')
	{
		// PROBLEM: Selection cleared when menuItems and toolbar buttons are clicked so the
		// full toolbar is required in IE for format options until a workaround exists.
		// See bug report at http://www.tinymce.com/forum/viewtopic.php?pid=101275
		tinyMCE.init({
			// General options
			mode : "none",
			theme : "advanced",
			plugins : "spellchecker,table,inlinepopups,paste,advimage",

			// Theme options
			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,image,unlink,link,|,forecolor,backcolor",
			theme_advanced_buttons3 : "tablecontrols,|,hr,|,sub,sup,|,code",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true
		});
	}
	else
	{
		tinyMCE.init({
			mode : "none",
			theme : "advanced",
			plugins : "spellchecker,table,inlinepopups,paste,advimage",

			// Theme options
			theme_advanced_buttons1: 'image,link,hr,|,cleanup,|,code',
			theme_advanced_buttons2: '',
			theme_advanced_buttons3: '',
			theme_advanced_toolbar_location : 'top',
			theme_advanced_toolbar_align : 'left',
			theme_advanced_statusbar_location : 'bottom',
			theme_advanced_resizing : false
		});
	}
}

// Downloadify for local file save
if (urlParams['flash'] == '1')
{
	mxscript('js/downloadify/downloadify.js');
	mxscript('js/downloadify/swfobject.js');
}

// Social network footer and analytics
if (urlParams['analytics'] != '0')
{
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-78007-10']);
	_gaq.push(['_setDomainName', '.draw.io']);
	_gaq.push(['_trackPageview']);

	mxinclude(('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js');
}

// Loads Google Image Picker API
if (urlParams['picker'] != '0' && !mxClient.IS_IE6)
{
	mxscript(document.location.protocol + '//www.google.com/jsapi?autoload=%7B%22modules%22%3A%5B%7B%22name%22%3A%22picker%22%2C%22version%22%3A%221%22%2C%22language%22%3A%22' + mxClient.language + '%22%7D%5D%7D');
}

// Color dialog - Do not add to diagramly.min.js due to path issues!
mxscript('js/jscolor/jscolor.js');

// For developers only
if (urlParams['test'] == '1' || urlParams['dev'] == '1')
{
	mxLog.show();
	mxLog.debug('Started in ' + (new Date().getTime() - t0.getTime()) + 'ms');
	mxLog.debug('Share:', SHARE_HOST);
	mxLog.debug('Export:', EXPORT_URL);
	mxLog.debug('Development mode:', (urlParams['dev'] == '1') ? 'active' : 'inactive');
	mxLog.debug('Test mode:', (urlParams['test'] == '1') ? 'active' : 'inactive');
}