var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function GlyphButton(clazz, title){
    Widget.call(this);
    this._element = $('<span class="glyphicon"></span>');
    this._element.addClass(clazz);
    this._element.attr('title', title);
}

extend(Widget, GlyphButton, {
    click: function(callback) {
        this._element.click(callback);
    }
});

GlyphButton.prototype.constructor = GlyphButton;

module.exports = GlyphButton;