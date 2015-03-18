var rk = require('rekuire');
var workspaceManager = rk('workspace-manager.js');

var command = {
    name: 'ws',
    func: function(args, terminal, manager, done) {
        var wsName = null;
        var workspace = null;

        // Adding a the workspace
        var i = args.indexOf('-a');
        if (i != -1) {
            if (!terminal._treebeard) {
                terminal.printLine('There is no folder open yet!');
            } else {
              args.splice(i, 1);
              wsName = args[0];
  
              if (!wsName) {
                  terminal.printLine('You must especifies a name for the workspace');
              } else {
                  try {
                    var path = terminal._treebeard._home;
                    workspaceManager.addWorkspace(wsName, path);

                    terminal.printLine(' Workspace Added! ');
                    terminal.printLine(' Name: ' + wsName);
                    terminal.printLine(' Path: ' + terminal._treebeard._home);
                  } catch (e){
                    terminal.printLine(e);
                    console.log(e);
                  }
              }
            }
            done();
            return;
        }

        // Quiting from an workspace
        i = args.indexOf('-q');
        if (i != -1) {
          args.splice(i, 1);
          workspaceManager.quit();
          done();
          return;
        }

        // Removing an workspace
        i = args.indexOf('-da');
        if (i != -1) {
          args.splice(i, 1);
          workspaceManager.removeAll();
          done();
          return;
        }

        // Removing an workspace
        i = args.indexOf('-d');
        if (i != -1) {
          args.splice(i, 1);
          wsName = args[0];
          workspaceManager.removeWorkspace(wsName);
          done();
          return;
        }

        // Opening an workspace
        if (args.length) {
          wsName = args[0];
          workspace = workspaceManager.open(wsName);
          if (!workspace) done();
          else {
            terminal.executeCommand(['openfolder', workspace.path()].join(' '), function() {
              terminal.printLine('Workspace ' + workspace.name() + ' loaded!');
              done();
            });
          }
          return;
        }

        // When there is no options we just list the avaible workspaces
        var workspaces = workspaceManager.list();
        terminal.printLine(' Saved workspaces: ');
        for (i in workspaces) {
          workspace = workspaces[i];
          terminal.printLine(' Name: ' + workspace.name());
          terminal.printLine(' Path: ' + workspace.path());
          terminal.printLine('-');
        }
        done();
    }
}
module.exports = command;