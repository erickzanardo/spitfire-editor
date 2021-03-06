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
        ENTER_KEY: 13,
        ESC_KEY: 27
    }
};

SpitfireManager = function(mousetrap, localStorage, $body) {
    this._inputListeners = [];
    this._actions = {};
    this._mousetrap = mousetrap;
    this._localStorage = localStorage;
    this._$body = $body;
    this._focusables = [];
    this._lastFocusable = null;
    this._withFocus = null;
    this._focusHistoryExclusion = [];
    this._gui = null;
    this._currentModal = null;
};

SpitfireManager.prototype.gui = function(gui) {
    if (gui) {
        this._gui = gui;
    }
    return this._gui;
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

SpitfireManager.prototype.registerFocusable = function(focusable, excludeFromHistory) {
    this._focusables.push(focusable);
    if (excludeFromHistory) {
        this._focusHistoryExclusion.push(focusable);
    }
};

SpitfireManager.prototype.focusOn = function(focusable) {
    if (this._withFocus != focusable) {
        if (this._focusHistoryExclusion.indexOf(this._withFocus) == -1) {
            this._lastFocusable = this._withFocus;
        }
        var focusableIndex = this._focusables.indexOf(focusable);
        if (focusableIndex != -1) {
            for (var i = 0 ; i < this._focusables.length ; i++) {
                var f = this._focusables[i];
                if (i == focusableIndex) {
                    f.focus(true);
                    this._withFocus = f;
                } else {
                    f.focus(false);
                }
            }
        }
    }
};

SpitfireManager.prototype.lastFocus = function() {
    if (this._lastFocusable) {
        this.focusOn(this._lastFocusable);
    } else {
        this._withFocus.focus(false);
        if (this._focusHistoryExclusion.indexOf(this._withFocus) == -1) {
            this._lastFocusable = this._withFocus;
        }
        this._withFocus = null;
    }
};

SpitfireManager.prototype.showPlainModal = function(title, body) {
    var modal = new Modal(this._$body, this);
    modal.title(title);
    modal.body(body);
    modal.addPrimaryButton('Ok', function() {
        modal.close();
    });
    modal.show();
    return modal;
};

SpitfireManager.prototype.showConfirmModal = function(title, body, onConfirm, onCancel) {
    var modal = new Modal(this._$body, this);
    modal.title(title);
    modal.body(body);
    modal.addDefaultButton('No', function() {
        modal.close();
        if (onCancel) {
            onCancel();
        }
    });
    modal.addPrimaryButton('Yes', function() {
        modal.close();
        if (onConfirm) {
            onConfirm();
        }
    });
    modal.show();
    return modal;
};

SpitfireManager.prototype.action = function(key, arguments) {
    var action = this._actions[key];
    return action.obj[action.func].apply(action.obj, arguments);
};

SpitfireManager.prototype.currentModal = function(modal) {
    if (modal !== undefined) {
        this._currentModal = modal;
    } else {
        return this._currentModal;
    }
};