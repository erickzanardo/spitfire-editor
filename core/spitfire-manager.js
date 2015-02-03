SpitfireManager = function() {
    this._inputListeners = [];
}

SpitfireManager.prototype.addInputListener = function(listener) {
    this._inputListeners.push(listener);
}

SpitfireManager.prototype.inputListeners = function() {
    return this._inputListeners;
}