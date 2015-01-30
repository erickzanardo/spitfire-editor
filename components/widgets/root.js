var Widget = require('./widget.js');

function Root(root){
    Widget.call(this);
    this._element = root;
}

Root.prototype = Object.create(Widget.prototype, {
    appendTo: function() {throw 'Unsupported'}
});

Root.prototype.constructor = Root;

module.exports = Root;