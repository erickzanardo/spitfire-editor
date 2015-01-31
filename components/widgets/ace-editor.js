var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function AceEditor(gui){
    Widget.call(this);
    this._element = $('<div class="se-ace-editor" id="editor1"></div>');
    this._gui = gui;
}

extend(Widget, AceEditor, {
    build: function() {
        var ace = this._gui.Window.get().window.ace;
        this._editor = ace.edit('editor1');
    },
    text: function(text) {
        this._element.text(text);
    }
});

AceEditor.prototype.constructor = AceEditor;

module.exports = AceEditor;