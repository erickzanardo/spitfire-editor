var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function AceEditor(gui, tabEditorId, id, filePath){
    Widget.call(this);
    this._myId = ['editor', tabEditorId, id].join('_');
    this._element = $('<div class="se-ace-editor"></div>');
    this._element.attr('id', this._myId);
    this._gui = gui;
    this._filePath = filePath;
}

extend(Widget, AceEditor, {
    build: function() {
        var ace = this._gui.Window.get().window.ace;
        this._editor = ace.edit(this._myId);
        var modelist = ace.require('ace/ext/modelist');
        var mode = modelist.getModeForPath(this._filePath).mode;
        this._editor.session.setMode(mode);
    },
    text: function(text) {
        this._element.text(text);
    }
});

AceEditor.prototype.constructor = AceEditor;

module.exports = AceEditor;