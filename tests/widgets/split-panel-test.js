var assert = require('../../assert.js');
var SplitPanel = require('../../components/widgets/split-panel.js');
var Panel = require('../../components/widgets/panel.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root) {

    var splitPanel = new SplitPanel();
    assert.isTrue(splitPanel.element().is('.se-split-panel-vertical'), 'Split panel is vertical by defaul');

    splitPanel.horizontal(true);
    assert.isTrue(splitPanel.element().is('.se-split-panel-horizontal'), 'Split panel must be horizontal when used horizontal function');

    gui.App.quit();
}

module.exports = new EditorEntry();