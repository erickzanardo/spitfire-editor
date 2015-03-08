var rk = require('rekuire');
var fu = rk('components/utils/file-utils.js');
var command = {
    name: 'mkdir',
    func: function(args, terminal, manager, done) {
        if (!terminal._currentFolder) {
            terminal.printLine('There is no folder open yet!');
            done();
            return;
        }

        var path = args[0];
        var basePath = terminal._currentFolder.path;
        var fullPath = [basePath, path].join('/');

        var treebeard = terminal._treebeard;
        fu.createDirs(fullPath, function(fullPath) {
            treebeard.addFolder(fullPath);

            manager.action('UPDATE_TREE_FOLDERS', [fullPath]);
            terminal.printLine(fullPath + ' created!')
            done();
        });
    }
};
module.exports = command;