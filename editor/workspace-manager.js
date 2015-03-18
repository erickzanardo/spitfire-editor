var WORKSPACE_KEY = 'Spitfire_Workspaces';

function Workspace(name, path, config) {
  this._name = name;
  this._path = path;
  this._config = config || {};
}

Workspace.prototype.name = function() {
  return this._name;
};

Workspace.prototype.path = function() {
  return this._path;
};

Workspace.prototype.config = function() {
  return this._config;
};

function WorkspaceManager() {
  this._manager = null;
  this._workspaces = {};
  this._currentWorkspace = null;
}

WorkspaceManager.prototype.init = function(manager) {
  this._manager = manager;

  var data = this._manager.localDb().get(WORKSPACE_KEY);
  for (var i in data) {
    var wsJson = data[i];
    this.addWorkspace(wsJson.name, wsJson.path, wsJson.config);
  }
};

WorkspaceManager.prototype.addWorkspace = function(name, path, config) {
  if (this._workspaces[name]) throw 'Workspace already exists';
  var workspace = new Workspace(name, path, config);
  this._workspaces[name] = workspace;
  this.save();
};

WorkspaceManager.prototype.removeWorkspace = function(name) {
  delete this._workspaces[name];
  this.save();
};

WorkspaceManager.prototype.removeAll = function() {
  this._workspaces = {};
  this.save();
};

WorkspaceManager.prototype.list = function() {
  return this._workspaces;
};

WorkspaceManager.prototype.open = function(name) {
  var ws = this._workspaces[name];
  this._currentWorkspace = ws;
  return ws;
}

WorkspaceManager.prototype.save = function() {
  var data = {};
  for (var i in this._workspaces) {
    var ws = this._workspaces[i];
    data[ws.name()] = {
      name: ws.name(),
      path: ws.path(),
      config: ws.config()
    };
  }
  this._manager.localDb().save(WORKSPACE_KEY, data);
}

module.exports = new WorkspaceManager();