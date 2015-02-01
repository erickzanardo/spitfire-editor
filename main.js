var SplitPanel = require('./components/widgets/split-panel.js');
var Panel = require('./components/widgets/panel.js');
var NavigationTree = require('./components/widgets/navigation-tree.js');
var TabEditor = require('./components/widgets/tab-editor.js');
var AceEditor = require('./components/widgets/ace-editor.js');

var $ = require('./core/libs/jquery-2.1.3.min.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root) {
    // Get the current window
    var nwin = gui.Window.get();
    nwin.maximize();

    // Clear loading properties
    root.element().html('');

    // Main panel contains the coding panel por navigation and ace editor and the terminal
    var mainPanel = new SplitPanel();
    mainPanel.horizontal(true);
    mainPanel.appendTo(root);

    var codePanel = new SplitPanel();
    codePanel.fixedSize(true);
    mainPanel.add(codePanel);

    var rightPanel = new Panel();
    var tabEditor = new TabEditor(gui, 1);
    tabEditor.appendTo(rightPanel);

    var leftPanel = new Panel();
    var navigationTree = new NavigationTree(tabEditor);
    navigationTree.appendTo(leftPanel);

    codePanel.add(leftPanel, 20);
    codePanel.add(rightPanel, 80);
}

module.exports = new EditorEntry();