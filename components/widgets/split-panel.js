var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function SplitPanel(){
    Widget.call(this);
    this._element = $('<div class="se-split-panel se-split-panel-vertical"></div>');
    this._horizontal = false;
    this._children = [];
}

extend(Widget, SplitPanel, {
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
    add: function(child) {
        this._children.push(child);
        this.calculateSizes();
    },
    calculateSizes: function() {
        var size = this._children.length;
        var value = Math.floor(100 / size);
        var sizeStr = [value, '%'].join('');
        for (var i = 0 ; i < this._children.length ; i++) {
            var children = this._children[i];
            if (this._horizontal) {
                children.element().css('height', sizeStr);
                children.element().css('width', '100%');
            } else {
                children.element().css('width', sizeStr);
                children.element().css('height', '100%');
            }
        }
    }
});

module.exports = SplitPanel;