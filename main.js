var SplitPanel = require('./components/widgets/split-panel.js');
var Panel = require('./components/widgets/panel.js');
var AceEditor = require('./components/widgets/ace-editor.js');

var $ = require('./core/libs/jquery-2.1.3.min.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root) {
    // Clear loading properties
    root.element().html('');
    var mainPanel = new SplitPanel();
    mainPanel.appendTo(root);

    var leftPanel = new Panel();
    var rightPanel = new Panel();

    mainPanel.add(leftPanel);
    mainPanel.add(rightPanel);

    aceEditor = new AceEditor(gui);
    aceEditor.appendTo(rightPanel);
    aceEditor.build();
}

module.exports = new EditorEntry();