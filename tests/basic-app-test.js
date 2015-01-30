var assert = require('../assert.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root) {
    var text = root.find('#SpitfireContainer').text();
    assert.eq('asdasd', text, 'SpitfireContainer should have Loading... text');

    gui.App.quit();
}

module.exports = new EditorEntry();