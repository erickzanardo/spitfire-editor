var rk = require('rekuire');
var workspaceManager = rk('workspace-manager.js');

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
  this.obj()[key] = value;
  this.save();
};

ConfigurationManager.prototype.get = function(key) {
  return this.obj()[key];
};

ConfigurationManager.prototype.add = function(key, value) {
  this.obj()[key].push(value);
  this.save();
};

ConfigurationManager.prototype.remove = function(key, value) {
  var obj = this.obj()[key];
  var i = obj.indexOf(value);
  obj.splice(i, 1);
  this.save();
};

ConfigurationManager.prototype.obj = function() {
  return workspaceManager.currentWorkspace() ?
    workspaceManager.currentWorkspace().config() :
    this.globalObj();
};

ConfigurationManager.prototype.globalObj = function() {
  return this._config;
};

ConfigurationManager.prototype.save = function() {
  if (workspaceManager.currentWorkspace()) {
    workspaceManager.save();
  } else {
    this._manager.localDb().save(CONFIG_KEY, this._config);
  }
};

module.exports = new ConfigurationManager();