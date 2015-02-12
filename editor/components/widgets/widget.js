function Widget() {
    this._element = null;
    this.parent = null;
}

Widget.prototype.element = function() {
    return this._element;
}

Widget.prototype.appendTo = function(target) {
    this.parent = target;
    this._element = this.element().appendTo(target.element());
}

module.exports = Widget;