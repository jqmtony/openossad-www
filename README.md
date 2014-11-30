openossad
=========


Architecture of the app
=======================



Palettes
--------

Palettes are managed on Sidebar.js, mxgraph Sidebar.js and Diagramly.js

OpenossadGraph
--------------

    this.getModel().beginUpdate();

    var cells = [];
    var cell = new mxCell('', new mxGeometry(5, 5, 815, 1155),'endArrow=none;fillColor=none');
    cell.vertex = true;
    cell.setConnectable(false);
    cells.push(cell);
    this.importCells(cells);

    this.getModel().endUpdate();

    this.setCellsResizable(false);
    this.setCellsMovable(false);
    this.setCellsSelectable(false);

    graph.moveCells(cells, 20, 20);


