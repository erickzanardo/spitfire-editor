function Workspace(name, path) {
  this._name= name;
  this._path = path;
  this._config = {};
}

function WorkspaceManager() {
  this._manager = null;
  this._workspaces = {};
}

WorkspaceManager.prototype.init = function(manager) {
  this._manager = manager;
};

WorkspaceManager.prototype.addWorkspace = function(name, path) {
  if (this._workspaces[name]) throw 'Workspace already exists';
  this._workspaces[name] = new Workspace(path, name);
};

WorkspaceManager.prototype.removeWorkspace = function(name) {
  delete this._workspaces[name];
};

module.exports = new WorkspaceManager();