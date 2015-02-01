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
    
    this._element.on('click', '.nav li a span.glyphicon-remove', function() {
        var i = $(this).parent().parent().index();
        me.closeTab(i);
        return false;
    });
}

extend(Widget, TabEditor, {
    openFile: function(name, path) {
        var me = this;
        var element = this._element;

        var openedFiles = element.find(['a[href="', path, '"]'].join(''));
        if (openedFiles.length) {
            me.hideSelectedTab();
            var i = openedFiles.parent().index();
            me.selectTab(i);
        } else {
            var gui = this._gui;

            var files = this._files;
            var editors = this._editors;

            var tabEditorId = this._id;


            fu.readFile(path, function (err, data) {
                if (err) throw err;

                me.hideSelectedTab();

                var editorContainer = element.find('.editor-container');
                var tabContainer = element.find('.nav');

                var aceEditor = new AceEditor(gui, tabEditorId, editors.length);
                editorContainer.append(aceEditor.element());
                aceEditor.text(data);
                aceEditor.build();

                var tab = $('<li role="presentation"><a href="#"><span class="glyphicon glyphicon-remove"></span></a>');
                var a = tab.children('a');
                a.attr('href', path);
                a.prepend(name);
                tabContainer.append(tab);

                me.selectTab(editors.length);
                files.push(path);
                editors.push(aceEditor);
            });
        }
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
    closeTab: function(index) {
        if (index == this._selectedTab) {
            this.hideSelectedTab();
        }
        this._files.splice(index, 1);
        this._editors.splice(index, 1);

        var editorContainer = this._element.find('.editor-container');
        var tabContainer = this._element.find('.nav');
        editorContainer.find('.se-ace-editor').eq(index).remove();
        tabContainer.find('li').eq(index).remove();

        if (index == this._selectedTab) {
            this._selectedTab--;
            if (this._selectedTab > -1) {
                this.selectTab(this._selectedTab);
            }
        } else if (index < this._selectedTab) {
            this._selectedTab--;
        }
    },
    closeAll: function() {
        while (this._editors.length) {
            this.closeTab(0);
        }
    },
    saveCurrentFile: function() {
    },
    saveAllFiles: function() {
    }
});

TabEditor.prototype.constructor = TabEditor;

module.exports = TabEditor;