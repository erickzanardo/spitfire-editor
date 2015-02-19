var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function FileSearch(manager){
    Widget.call(this);
    this._treebeard = null;
    this._focus = false;
    
    var element = '<div class="panel panel-default se-file-search">' +
                  '  <div class="panel-body">' +
                  '    <input type="text" class="form-control"></input>' +
                  '  </div>' +
                  '</div>';
    this._element = $(element);

    var me = this;
    var helperKeys = manager.keyManager().helperKeys;
    this._element.find('input[type=text]').keydown(function(e) {
        var key = e.which;
        console.log(key);
        if (key == helperKeys.ESC_KEY) {
            console.log('esccc')
            manager.lastFocus();
        } else {
            var result = [];
            if (me._treebeard) {
                result = me._treebeard.searchFiles($(this).val());
            }
            console.log(result);
        }
    });

    manager.registerAction('SET_FOLDER', this, 'setFolder');
}

extend(Widget, FileSearch, {
    setFolder: function(treebeard) {
        this._treebeard = treebeard;
    },
    focus: function(focus) {
        this._focus = focus;
        if (focus) {
            var e = this._element;
            e.fadeIn('fast', function() { e.find('input[type=text]').focus() });
        } else {
            this._element.fadeOut();
        }
    },
    hasFocus: function() {
        return this._focus;
    }
});

FileSearch.prototype.constructor = FileSearch;

module.exports = FileSearch;