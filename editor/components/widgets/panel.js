var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function Panel(){
    Widget.call(this);
    this._element = $('<div class="se-panel"></div>');
}

extend(Widget, Panel, {});

Panel.prototype.constructor = Panel;

module.exports = Panel;