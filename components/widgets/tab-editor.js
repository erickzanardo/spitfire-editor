var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var AceEditor = require('./ace-editor.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function TabEditor(gui, id){
    Widget.call(this);
    this._element = $('<div class="se-tab-panel"><ul class="nav nav-tabs"></li></ul><div class="editor-container"></div></div>');
    this._gui = gui;
    this._files = [];
    this._editors = [];
    this._id = id;
    this._selectedTab = -1;

    var me = this;
    this._element.on('click', '.nav li a', function() {
        var i = $(this).parent().index();
        me.hideSelectedTab();
        me.selectTab(i);
        return false;
    });
}

extend(Widget, TabEditor, {
    openFile: function(name, path) {
        var me = this;
        var gui = this._gui;

        var files = this._files;
        var editors = this._editors;

        var tabEditorId = this._id;
        var element = this._element;

        fu.readFile(path, function (err, data) {
            if (err) throw err;
            
            me.hideSelectedTab();
            
            var editorContainer = element.find('.editor-container');
            var tabContainer = element.find('.nav');

            var aceEditor = new AceEditor(gui, tabEditorId, editors.length);
            editorContainer.append(aceEditor.element());
            aceEditor.text(data);
            aceEditor.build();

            var tab = $('<li role="presentation"><a href="#"></a>');
            var a = tab.children('a');
            a.attr('href', path);
            a.text(name);
            tabContainer.append(tab);

            me.selectTab(editors.length);
            files.push(path);
            editors.push(aceEditor);
        });
    },
    hideSelectedTab: function() {
        var index = this._selectedTab;
        if (index != -1) {
            var editorContainer = this._element.find('.editor-container');
            var tabContainer = this._element.find('.nav');
            editorContainer.find('.se-ace-editor').eq(index).hide();

            tabContainer.find('li').eq(index).removeClass('active');
        }
    },
    selectTab: function(index) {
        this._selectedTab = index;
        var editorContainer = this._element.find('.editor-container');
        var tabContainer = this._element.find('.nav');

        editorContainer.find('.se-ace-editor').eq(index).show();
        tabContainer.find('li').eq(index).addClass('active');
    },
    saveCurrentFile: function() {
    },
    saveAllFiles: function() {
    }
});

TabEditor.prototype.constructor = TabEditor;

module.exports = TabEditor;