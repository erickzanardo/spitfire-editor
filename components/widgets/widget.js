function Widget() {
    this._element = null;
    this.parent = null;
}

Widget.prototype.element = function() {
    return this._element;
}

Widget.prototype.appendTo = function(target) {
    this.parent = target;
    target.element().append(this._element);
}

module.exports = Widget;