var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var AceEditor = require('./ace-editor.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function TabEditor(gui, id, manager){
    Widget.call(this);
    this._editorCount = 0;
    this._element = $('<div class="se-tab-panel"><ul class="nav nav-tabs"></li></ul><div class="editor-container"></div></div>');
    this._gui = gui;
    this._files = [];
    this._editors = [];
    this._id = id;
    this._selectedTab = -1;
    this._manager = manager;
    this._focus = false;

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
    hasFocus: function() {
        return this._focus;
    },
    focus: function(focus) {
        this._focus = focus;
        if (focus) {
            this.selectTab(this._selectedTab);
        }
    },
    openFile: function(name, path) {
        var me = this;
        var element = this._element;

        var openedFiles = element.find(['a[href="', path, '"]'].join(''));
        var manager = this._manager;
        if (openedFiles.length) {
            me.hideSelectedTab();
            var i = openedFiles.parent().index();
            me.selectTab(i);
            manager.focusOn(me);
        } else {
            var gui = this._gui;

            var files = this._files;
            var editors = this._editors;

            var tabEditorId = this._id;

            fu.readFile(path, manager, function (err, data) {
                if (err) throw err;

                me.hideSelectedTab();

                var editorContainer = element.find('.editor-container');
                var tabContainer = element.find('.nav');

                var aceEditor = new AceEditor(gui, me._manager, me, tabEditorId, me._editorCount++, path);
                editorContainer.append(aceEditor.element());
                aceEditor.text(data);
                aceEditor.build();

                var tab = $('<li role="presentation"><a href="#"><span class="glyphicon glyphicon-remove"></span></a>');
                var a = tab.children('a');
                a.attr('href', path);
                a.prepend(name);
                tabContainer.append(tab);

                editors.push(aceEditor);
                me.selectTab(editors.length - 1);
                files.push(path);
                manager.focusOn(me);
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
            this._editors[index].ace().blur();
        }
    },
    selectTab: function(index) {
        if (index != -1) {
            this._selectedTab = index;
            var editorContainer = this._element.find('.editor-container');
            var tabContainer = this._element.find('.nav');

            editorContainer.find('.se-ace-editor').eq(index).show();
            tabContainer.find('li').eq(index).addClass('active');

            this._editors[index].ace().focus();
        }
    },
    closeTab: function(index) {
        var me = this;
        var editor = me._editors[index];
        var close = function() {
            if (index == me._selectedTab) {
                me.hideSelectedTab();
            }
            me._files.splice(index, 1);
            me._editors.splice(index, 1);

            var editorContainer = me._element.find('.editor-container');
            var tabContainer = me._element.find('.nav');
            editorContainer.find('.se-ace-editor').eq(index).remove();
            tabContainer.find('li').eq(index).remove();

            if (index == me._selectedTab) {
                if (me._selectedTab == me._editors.length) {
                    me._selectedTab = me._editors.length - 1;
                }

                if (me._selectedTab != -1) {
                    me.selectTab(me._selectedTab);
                }
            } else if (index < me._selectedTab) {
                me._selectedTab--;
            }
        }

        if (editor.hasChanges()) {
            editor.ace().blur();
            this._manager.
                showConfirmModal('File has changes',
                                 'This file has changes. Are you sure you want to close it?',
                                 close,
                                 function() { editor.ace().focus(); });
        } else {
            close();
        }
    },
    markAsChanged: function(editor) {
        var index = this._editors.indexOf(editor);
        var tabContainer = this._element.find('.nav');
        tabContainer.find('li').eq(index).children('a').addClass('changed');
    },
    markAsUnchanged: function(editor) {
        var index = this._editors.indexOf(editor);
        var tabContainer = this._element.find('.nav');
        tabContainer.find('li').eq(index).children('a').removeClass('changed');
    },
    closeCurrentTab: function() {
        var me = this;
        me.closeTab(me._selectedTab);
    },
    nextTab: function() {
        this.hideSelectedTab();
        this._selectedTab++;
        if (this._selectedTab > this._editors.length - 1 ) {
            this._selectedTab = 0;
        }
        this.selectTab(this._selectedTab);
    },
    prevTab: function() {
        this.hideSelectedTab();
        this._selectedTab--;
        if (this._selectedTab < 0) {
            this._selectedTab = this._editors.length - 1;
        }
        this.selectTab(this._selectedTab);
    },
    closeAll: function() {
        while (this._editors.length) {
            this.closeTab(0);
        }
    },
    _saveEditorContent: function(editor) {
        var filePath = editor.filePath();
        var content = editor.content();
        var me = this;
        fu.saveFile(filePath, this._manager, content, function() {
            editor.saved();
            me.markAsUnchanged(editor);
        });
    },
    saveCurrentFile: function() {
        var editor = this._editors[this._selectedTab];
        this._saveEditorContent(editor);
    },
    saveAllFiles: function() {
        for (var i = 0 ; i < this._editors.length ; i++) {
            var editor = this._editors[i];
            this._saveEditorContent(editor);
        }
    },
    _updateEditorsFont: function() {
        this._manager.saveConfigs();
        for (var i = 0 ; i < this._editors.length ; i++) {
            var editor = this._editors[i];
            editor.setFontSize(this._manager.config.editorFontSize);
        }
    },
    zoomIn: function() {
        this._manager.config.editorFontSize++;
        this._updateEditorsFont();
    },
    zoomOut: function() {
        if (this._manager.config.editorFontSize > 1) {
            this._manager.config.editorFontSize--;
            this._updateEditorsFont();
        }
    }
});

TabEditor.prototype.constructor = TabEditor;

module.exports = TabEditor;