var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function SplitPanel(){
    Widget.call(this);
    this._element = $('<div class="se-split-panel se-split-panel-vertical"></div>');
    this._horizontal = false;
}

extend(Widget, SplitPanel, {
    horizontal: function(horizontal) {
        this._horizontal = horizontal;
        this._element.removeClass('se-split-panel-vertical');
        this._element.removeClass('se-split-panel-horizontal');
        this._element.addClass(horizontal ? 'se-split-panel-horizontal' : 'se-split-panel-vertical');
    }
});

module.exports = SplitPanel;