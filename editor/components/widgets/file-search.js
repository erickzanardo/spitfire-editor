var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function FileSearch(manager, tabEditor){
    Widget.call(this);
    this._treebeard = null;
    this._focus = false;
    
    var element = '<div class="panel panel-default se-file-search">' +
                  '  <div class="panel-body">' +
                  '    <input type="text" class="form-control"></input>' +
                  '    <table class="table"><tbody></tbody></table>' +
                  '  </div>' +
                  '</div>';
    this._element = $(element);
    this._tbody = this._element.find('tbody');

    this._element.on('click', '.panel-body .table tr td > a', function() {
        var me = $(this);
        var path = me.attr('href');
        tabEditor.openFile(me.text(), path);
        return false;
    });

    var me = this;
    var navigate = function(down) {
        var active = me._tbody.find('tr.active');
        var dest = down ? active.next() : active.prev();
        if (dest.length) {
            active.removeClass('active');
            dest.addClass('active');
        }
    };

    var helperKeys = manager.keyManager().helperKeys;
    this._element.find('input[type=text]').keyup(function(e) {
        var key = e.which;
        if (key == helperKeys.ESC_KEY) {
            manager.lastFocus();
        } else if (key == helperKeys.DOWN_KEY || key == helperKeys.UP_KEY) {
            navigate(key == helperKeys.DOWN_KEY);
        } else if (key == helperKeys.ENTER_KEY) {
            me._tbody.find('tr.active a').click();
        } else {
            var result = [];
            if (me._treebeard) {
                result = me._treebeard.searchFiles($(this).val());
                me._buildResults(result);
            }
        }
    });

    manager.registerAction('SET_FOLDER', this, 'setFolder');
}

extend(Widget, FileSearch, {
    setFolder: function(treebeard) {
        this._treebeard = treebeard;
    },
    _buildResultLine: function(node) {
        var tr = $('<tr><td><a href="#"></a><span></span></td></tr>');
        var a  = tr.find('a');
        a.text(node.name);
        a.attr('href', node.path);
        tr.find('span').text(node.path);
        tr.appendTo(this._tbody);
    },
    _buildResults: function(results) {
        this._removeResults();
        // Limiting of 10 results
        var length = Math.min(results.length, 10);
        for (var i = 0 ; i < length; i++) {
            var r = results[i];
            this._buildResultLine(r);
        }
        // Set focus on the first
        this._tbody.find('tr:first').addClass('active');
    },
    _removeResults: function() {
        this._tbody.children().remove();
    },
    focus: function(focus) {
        this._focus = focus;
        if (focus) {
            this._element.find('input[type=text]').val('');
            this._removeResults();
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