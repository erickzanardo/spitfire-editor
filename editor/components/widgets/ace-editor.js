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
    content: function() {
        return this._editor.getSession().getValue();
    },
    filePath: function() {
        return this._filePath;
    },
    build: function() {
        var me = this;
        var manager = this._manager;
        var tabEditor = this._tabEditor;
        var ace = this._gui.Window.get().window.ace;
        var editor = ace.edit(this._myId);
        var modelist = ace.require('ace/ext/modelist');
        var mode = modelist.getModeForPath(this._filePath).mode;
        editor.session.setMode(mode);
        editor.setTheme("ace/theme/tomorrow_night");

        ace.require("ace/ext/language_tools");
        
        editor.on('focus', function() {
           me._manager.focusOn(me._tabEditor); 
        });
        
        editor.setOption('showInvisibles', manager.config.showWhitespaces === 'true');
        editor.setFontSize(manager.config.editorFontSize);
        var tabSize = parseInt(manager.config.tabSize);
        tabSize = isNaN(tabSize) ? 4 : tabSize;
        editor.getSession().setTabSize(tabSize);

        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
        
        editor.on('change', function() {
            me._changed = true;
            tabEditor.markAsChanged(me);
        });
        
        editor.commands.addCommand({
            name: 'lose focus',
            bindKey: {win: 'esc', mac: 'esc'},
            exec: function(editor) {
                editor.blur();
                manager.lastFocus();
            }
        });
        // TODO Need to test this on a mac!
        editor.commands.addCommand({
            name: 'next tab',
            bindKey: {win: 'Ctrl-Tab', mac: 'Command-Option-Tab'},
            exec: function(editor) {
                tabEditor.nextTab();
            }
        });
        editor.commands.addCommand({
            name: 'prev tab',
            bindKey: {win: 'Ctrl-Shift-Tab', mac: 'Command-Option-Shift-Tab'},
            exec: function(editor) {
                tabEditor.prevTab();
            }
        });
        editor.commands.addCommand({
            name: 'close tab',
            bindKey: {win: 'Ctrl-W', mac: 'Command-Option-W'},
            exec: function(editor) {
                tabEditor.closeCurrentTab();
            }
        });
        editor.commands.addCommand({
            name: 'save',
            bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
            exec: function(editor) {
                tabEditor.saveCurrentFile();
            }
        });
        editor.commands.addCommand({
            name: 'save all',
            bindKey: {win: 'Ctrl-Shift-S', mac: 'Command-Shift-S'},
            exec: function(editor) {
                tabEditor.saveAllFiles();
            }
        });
        editor.commands.addCommand({
            name: 'zoom in',
            bindKey: {win: 'Ctrl-+', mac: 'Command-+'},
            exec: function(editor) {
                tabEditor.zoomIn();
            }
        });
        editor.commands.addCommand({
            name: 'zoom out',
            bindKey: {win: 'Ctrl--', mac: 'Command--'},
            exec: function(editor) {
                tabEditor.zoomOut();
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
    },
    setFontSize: function(size) {
        this._editor.setFontSize(size);
    }
});

AceEditor.prototype.constructor = AceEditor;

module.exports = AceEditor;