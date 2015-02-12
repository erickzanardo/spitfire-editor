var extend = require('../utils/extends.js');
var Widget = require('./widget.js');

function Root(root){
    Widget.call(this);
    this._element = root;
}

extend(Widget, Root, {});

Root.prototype.constructor = Root;

module.exports = Root;