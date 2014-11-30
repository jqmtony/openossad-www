
OpenossadGraph = function(container, model, renderHint, stylesheet)
{
	Graph.call(this, container, model, renderHint, stylesheet);

    this.setTooltips(true);

    this.getModel().beginUpdate();

    var cells = [];
    var cell = new mxCell("", new mxGeometry(1, 1, 80, 30));
    cell.vertex = true;
    cell.setConnectable(false);


    cells.push(cell);
    this.importCells(cells);

    this.getModel().endUpdate();

//    graph.moveCells(cells, 20, 20);

};

// OpenossadGraph inherits from Graph
mxUtils.extend(OpenossadGraph, Graph);


/**
 * Overrides tooltips to show position and size
 */
OpenossadGraph.prototype.getTooltipForCell = function(cell)
{
    var tip = '';

    if (this.getModel().isVertex(cell))
    {
        tip += 'This is an openossad test';
    }
    else if (this.getModel().isEdge(cell))
    {
        tip = mxGraph.prototype.getTooltipForCell.apply(this, arguments);
    }

    return tip;
};

