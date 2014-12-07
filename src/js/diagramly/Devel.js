/*
 * $Id: Devel.js,v 1.14 2013-01-16 16:06:57 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
// This provides an indirection to make sure the mxClient.js
// loads before the dependent classes below are loaded. This
// is used for development mode where the JS is in separate
// files and the mxClient.js loads other files.

// Uses grapheditor from devhost
// openossad sdk
mxscript('openossad/sdk/ooPoint.js');
mxscript('openossad/sdk/ooRectangle.js');
mxscript('js/openossad/ooLog.js');
mxscript('js/openossad/ooClient.js');
mxscript('js/openossad/ooConstants.js');
mxscript('js/openossad/ooUtils.js');

//mxscript(geBasePath +'/OpenossadEditor.js');
mxscript(geBasePath +'/Editor.js');
mxscript(geBasePath +'/Graph.js');
mxscript(geBasePath +'/OpenossadGraph.js');
mxscript(geBasePath +'/Shapes.js');
mxscript(geBasePath +'/EditorUi.js');
mxscript(geBasePath +'/Actions.js');
mxscript(geBasePath +'/Menus.js');
mxscript(geBasePath +'/Sidebar.js');
mxscript(geBasePath +'/Toolbar.js');
mxscript(geBasePath +'/Dialogs.js');

// Loads main class
mxscript('js/diagramly/GoogleDrive.js');
mxscript('js/diagramly/Integration.js');
mxscript('js/diagramly/Dialogs.js');
mxscript('js/diagramly/OpenossadDialogs.js');
mxscript('js/diagramly/Sidebar.js');
mxscript('js/diagramly/Format.js');
mxscript('js/diagramly/storage/File.js');
mxscript('js/diagramly/storage/StorageFile.js');
mxscript('js/diagramly/storage/LocalFile.js');
mxscript('js/diagramly/EditorUi.js');

mxscript('js/googledrive/DriveClient.js');
mxscript('js/dropbox/DropboxClient.js');
mxscript('js/openossad/App.js');
mxscript('js/diagramly/Sharing.js');

mxscript('js/diagramly/Diagramly.js');


