var assert = require('../../assert.js');
var Panel = require('../../components/widgets/panel.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root) {

    var panel = new Panel();
    panel.appendTo(root);
    assert.eq(true, root.element().find('div').is('.se-panel'), 'Panel should be appended to root');
    gui.App.quit();
}

module.exports = new EditorEntry();