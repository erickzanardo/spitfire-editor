var CONFIG_KEY = 'Spitfire_Config';

var defaultConfig = {
    charset: 'utf-8',
    editorFontSize: 14,
    trustedNativeCommands: [],
    showWhitespaces: true,
    tabSize: 4
};

function ConfigurationManager() {
  this._manager = null;
  this._config = null;
}

ConfigurationManager.prototype.init = function(manager) {
  this._manager = manager;

  var config = manager.localDb().get(CONFIG_KEY);
  this._config = config || defaultConfig;
};

ConfigurationManager.prototype.set = function(key, value) {
  this._config[key] = value;
  this.save();
};

ConfigurationManager.prototype.get = function(key) {
  return this._config[key];
};

ConfigurationManager.prototype.add = function(key, value) {
  this._config[key].push(value);
  this.save();
};

ConfigurationManager.prototype.remove = function(key, value) {
  var i = this._config[key].indexOf(value);
  this._config[key].splice(i, 1);
  this.save();
};

ConfigurationManager.prototype.save = function() {
  this._manager.localDb().save(CONFIG_KEY, this._config);
};

module.exports = new ConfigurationManager();