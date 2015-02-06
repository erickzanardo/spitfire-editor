var keyManager = {
    helperKeys: {
        BACKSPACE_KEY: 8,
        CONTROL_KEY: 17,
        ALT_KEY: 18,
        LEFT_KEY: 37,
        UP_KEY: 38,
        RIGHT_KEY: 39,
        DOWN_KEY: 40,
        TAB_KEY: 9,
        ENTER_KEY: 13
    }
};

SpitfireManager = function(mousetrap, localStorage) {
    this._inputListeners = [];
    this._actions = {};
    this._mousetrap = mousetrap;
    this._localStorage = localStorage;
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

SpitfireManager.prototype.registerShortcut = function(shortcut, callback) {
    this._mousetrap.bind(shortcut, callback);
};

SpitfireManager.prototype.localDb = function() {
    var ls = this._localStorage;
    return {
        save: function(key, json) {
            ls.setItem(key, JSON.stringify(json));
        },
        get: function(key) {
            var item = ls.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
            return null;
        }
    };
};

SpitfireManager.prototype.action = function(key, args) {
    var action = this._actions[key];
    return action.obj[action.func](args);
};