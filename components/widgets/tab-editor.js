var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var AceEditor = require('./ace-editor.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function TabEditor(gui){
    Widget.call(this);
    this._element = $('<div class="se-tab-panel"></div>');
    this._gui = gui;
}

extend(Widget, TabEditor, {
    openFile: function(path) {
        var me = this;
        var gui = this._gui;
        fu.readFile(path, function (err, data) {
            if (err) throw err;
            var aceEditor = new AceEditor(gui);
            aceEditor.appendTo(me);
            aceEditor.text(data);
            aceEditor.build();
        });
    },
    saveCurrentFile: function() {
    },
    saveAllFiles: function() {
    }
});

TabEditor.prototype.constructor = TabEditor;

module.exports = TabEditor;