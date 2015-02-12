var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function AceEditor(gui, manager, tabEditor, tabEditorId, id, filePath){
    Widget.call(this);
    this._myId = ['editor', tabEditorId, id].join('_');
    this._element = $('<div class="se-ace-editor"></div>');
    this._element.attr('id', this._myId);
    this._gui = gui;
    this._manager = manager;
    this._filePath = filePath;
    this._editor = null;
    this._tabEditor = tabEditor;
    this._changed = false;
}

extend(Widget, AceEditor, {
    build: function() {
        var me = this;
        var ace = this._gui.Window.get().window.ace;
        
        var editor = ace.edit(this._myId);
        var modelist = ace.require('ace/ext/modelist');
        var mode = modelist.getModeForPath(this._filePath).mode;
        editor.session.setMode(mode);

        var manager = this._manager;
        var tabEditor = this._tabEditor;
        
        editor.on('change', function() {
            me._changed = true;
            tabEditor.markAsChanged(me);
        });
        
        editor.commands.addCommand({
            name: "lose focus",
            bindKey: {win: "esc", mac: "esc"},
            exec: function(editor) {
                editor.blur();
                manager.lastFocus();
            }
        });
        // TODO Need to test this on a mac!
        editor.commands.addCommand({
            name: "next tab",
            bindKey: {win: "Ctrl-Tab", mac: "Command-Option-Tab"},
            exec: function(editor) {
                tabEditor.nextTab();
            }
        });
        editor.commands.addCommand({
            name: "prev tab",
            bindKey: {win: "Ctrl-Shift-Tab", mac: "Command-Option-Shift-Tab"},
            exec: function(editor) {
                tabEditor.prevTab();
            }
        });
        editor.commands.addCommand({
            name: "prev tab",
            bindKey: {win: "Ctrl-W", mac: "Command-Option-W"},
            exec: function(editor) {
                tabEditor.closeCurrentTab();
            }
        });
        this._editor = editor;
    },
    text: function(text) {
        this._element.text(text);
    },
    ace: function() {
        return this._editor;
    },
    hasChanges: function() {
        return this._changed;
    },
    saved: function() {
        this._changed = false;
    }
});

AceEditor.prototype.constructor = AceEditor;

module.exports = AceEditor;