var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function NavigationTree(){
    Widget.call(this);
    this._element = $('<ul class="navigation-tree"></ul>');
}

extend(Widget, NavigationTree, {
    openFolder: function(path) {
        var tree = fu.readDirTree(path.split('/'));
        this._buildFolder(tree, this._element);

        this._element.find('.folder > a').click(function() {
            var me = $(this);
            
            var span = me.prev();
            if (span.is('.glyphicon-folder-close')) {
                span.removeClass('glyphicon-folder-close');
                span.addClass('glyphicon-folder-open');
                me.next().slideDown();
            } else {
                span.removeClass('glyphicon-folder-open');
                span.addClass('glyphicon-folder-close');
                me.next().slideUp();
            }
            return false;
        });
    },
    _buildFolder: function(folder_itens, element) {
        for (var i = 0 ; i < folder_itens.length ; i++) {
            var node = folder_itens[i];

            // It's a folder
            if (node.tree) {
                var folder = $('<li class="folder"><span class="glyphicon glyphicon-folder-close"></span><a href="#"></a></li>');
                folder.children('a').text(node.name);
                element.append(folder);
                var list = $('<ul></ul>');
                list.hide();
                this._buildFolder(node.tree, list.appendTo(folder));
            } else {
                var file = $('<li class="file"><span></span><a href="#"></a></li>');
                file.children('a').text(node.name);
                element.append(file);
            }
        }
    }
});

NavigationTree.prototype.constructor = NavigationTree;

module.exports = NavigationTree;