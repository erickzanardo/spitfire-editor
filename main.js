var SplitPanel = require('./components/widgets/split-panel.js');
var Panel = require('./components/widgets/panel.js');
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

    var leftPanel = new Panel();
    var rightPanel = new Panel();

    codePanel.add(leftPanel, 20);
    codePanel.add(rightPanel, 80);

    aceEditor = new AceEditor(gui);
    aceEditor.appendTo(rightPanel);
    aceEditor.build();
}

module.exports = new EditorEntry();