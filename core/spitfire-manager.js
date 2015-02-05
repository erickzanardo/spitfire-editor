var keyManager = {
    helperKeys: {
        BACKSPACE_KEY: 8,
        CONTROL_KEY: 18,
        LEFT_KEY: 37,
        RIGHT_KEY: 39,
        ENTER_KEY: 13
    }
};

SpitfireManager = function() {
    this._inputListeners = [];
    this._actions = {};
};

SpitfireManager.prototype.addInputListener = function(listener) {
    this._inputListeners.push(listener);
};

SpitfireManager.prototype.inputListeners = function() {
    return this._inputListeners;
};

SpitfireManager.prototype.keyManager = function() {
    return keyManager;
};

SpitfireManager.prototype.registerAction = function(key, obj, func) {
    this._actions[key] = {obj: obj, func: func};
};

SpitfireManager.prototype.action = function(key, args) {
    var action = this._actions[key];
    return action.obj[action.func](args);
};