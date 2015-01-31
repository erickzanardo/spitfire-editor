var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function SplitPanel(){
    Widget.call(this);
    this._element = $('<div class="se-split-panel se-split-panel-vertical"></div>');
    this._horizontal = false;
    this._children = [];
    this._fixedSize = false;
}

extend(Widget, SplitPanel, {
    fixedSize: function(fixedSize) {
        this._fixedSize = fixedSize;
    },
    children: function() {
        return this._children;
    },
    remove: function(index) {
        this._children.splice(index, 1);
        this.calculateSizes();
    },
    horizontal: function(horizontal) {
        this._horizontal = horizontal;
        this._element.removeClass('se-split-panel-vertical');
        this._element.removeClass('se-split-panel-horizontal');
        this._element.addClass(horizontal ? 'se-split-panel-horizontal' : 'se-split-panel-vertical');
        this.calculateSizes();
    },
    add: function(child, size) {
        this._children.push({element: child, size: size});
        this.calculateSizes();
        child.appendTo(this);
    },
    calculateSizes: function() {
        var value = null;
        if (!this._fixedSize) {
            var size = this._children.length;
            value = Math.floor(100 / size);
        }

        for (var i = 0 ; i < this._children.length ; i++) {
            var children = this._children[i];
            var sizeStr = [value || children.size, '%'].join('');
            this._setChildrenSize(children, sizeStr);
        }
    },
    _setChildrenSize: function(children, sizeStr) {
        if (this._horizontal) {
            children.element.element().css('height', sizeStr);
            children.element.element().css('width', '100%');
        } else {
            children.element.element().css('width', sizeStr);
            children.element.element().css('height', '100%');
        }
    }
});

module.exports = SplitPanel;