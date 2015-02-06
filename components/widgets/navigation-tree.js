var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function NavigationTree(tabEditor, manager){
    Widget.call(this);
    this._element = $('<div class="navigation-tree-container"><ul class="navigation-tree"></ul></div>');
    this._tabEditor = tabEditor;
    this._focus = false;

    manager.registerAction('OPEN_FOLDER', this, 'openFolder');
    manager.registerAction('UPDATE_TREE_FOLDERS', this, '_updateTreeFolders');
    manager.registerAction('UPDATE_TREE_FILE', this, '_updateTreeFile');

    var keyManager = manager.keyManager();
    var helperKeys = keyManager.helperKeys;

    var me = this;
    manager.addInputListener(function(e) {
        if (me.hasFocus()) {
            var key = e.which;
            var current = me.element().find('.navigation-tree li.current');

            if (current.length) {
                if (key == helperKeys.DOWN_KEY) {
                    var next;
                    if (current.is('.folder') && current.is('.open')) {
                        var first = current.find('ul li:first');
                        next = first.length ? first : current.next();
                    } else {
                        next = current.next();
                    }
                    if (next.length) {
                        current.removeClass('current');
                        next.addClass('current');
                    }
                } else if (key == helperKeys.UP_KEY) {
                    var prev = current.prev();
                    if (prev.length) {
                        current.removeClass('current');
                        prev.addClass('current');
                    }
                } else if (key == helperKeys.ENTER_KEY) {
                    current.children('a').click();
                }
            }
            return false;
        }
        return true;
    });
}

extend(Widget, NavigationTree, {
    _updateTreeFolders: function(folders) {
        for (var i = 0 ; i < folders.length ; i++) {
            var folder = folders[i];
            var parent = this._element.find('a[href="' + folder.parent + '"]').closest('li.folder').find('ul');
            if (!parent.length) {
                // This folder goes in the root
                parent = this._element.find('ul.navigation-tree');
            }
            parent.append(this._createFolderElement(folder.node));
        }
    },
    _updateTreeFile: function(file) {
            var parent = this._element.find('a[href="' + file.parent + '"]').closest('li.folder').find('ul');
            if (!parent.length) {
                // This folder goes in the root
                parent = this._element.find('ul.navigation-tree');
            }
            parent.append(this._createFileElement(file.node));
    },
    focus: function(focus) {
        this._focus = focus;
        if (focus) {
            this._element.addClass('active');
            var current = this.element().find('.navigation-tree li.current');
            if (!current.length) {
                this.element().find('.navigation-tree li:first').addClass('current');
            }
        } else {
            this._element.removeClass('active');
        }
    },
    hasFocus: function() {
        return this._focus;
    },
    openFolder: function(path) {
        var tree = fu.readDirTree(path.split('/'));
        this._buildFolder(tree, this._element.find('.navigation-tree'));

        this._element.on('click', '.folder > a', function() {
            var me = $(this);
            
            var span = me.prev();
            if (span.is('.glyphicon-folder-close')) {
                span.removeClass('glyphicon-folder-close');
                span.addClass('glyphicon-folder-open');
                span.closest('li').addClass('open');
                me.next().slideDown();
            } else {
                span.removeClass('glyphicon-folder-open');
                span.addClass('glyphicon-folder-close');
                span.closest('li').removeClass('open');
                me.next().slideUp();
            }
            return false;
        });

        var te = this._tabEditor;
        this._element.on('click', '.file > a', function() {
            var me = $(this);
            var path = me.attr('data-path');
            te.openFile(me.text(), path);
            return false;
        });

        return tree;
    },
    _createFolderElement: function(node) {
        var folder = $('<li class="folder"><span class="glyphicon glyphicon-folder-close"></span><a href="#"></a></li>');
        folder.children('a').text(node.name);
        folder.children('a').attr('href', node.path.join('/'));
        var list = $('<ul></ul>');
        list.hide();
        folder.append(list);
        return folder;
    },
    _createFileElement: function(node) {
        var file = $('<li class="file"><span></span><a href="#"></a></li>');
        var a = file.children('a');
        a.text(node.name);
        a.attr('data-path', node.path.join('/'));
        return file;
    },
    _buildFolder: function(folder_itens, element) {
        for (var i = 0 ; i < folder_itens.length ; i++) {
            var node = folder_itens[i];

            // It's a folder
            if (node.tree) {
                var folder = this._createFolderElement(node);
                element.append(folder);
                this._buildFolder(node.tree, folder.children('ul'));
            } else {
                element.append(this._createFileElement(node));
            }
        }
    }
});

NavigationTree.prototype.constructor = NavigationTree;

module.exports = NavigationTree;