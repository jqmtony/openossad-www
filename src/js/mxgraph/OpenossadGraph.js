/**
 * $Id: Graph.js,v 1.12 2013-02-02 15:37:13 gaudenz Exp $
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph instance. Note that the constructor does not take a
 * container because the graph instance is needed for creating the UI, which
 * in turn will create the container for the graph. Hence, the container is
 * assigned later in EditorUi.
 */
OpenossadGraph = function(container, model, renderHint, stylesheet)
{
	Graph.call(this, container, model, renderHint, stylesheet);

};

// Graph inherits from mxGraph
mxUtils.extend(OpenossadGraph, Graph);