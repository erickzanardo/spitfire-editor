var rk = require('rekuire');
var fu = rk('components/utils/file-utils.js');

var command = {
    name: 'touch',
    func: function(args, terminal, manager, done) {
        if (!terminal._currentFolder) {
            terminal.printLine('There is no folder open yet!');
            done();
            return;
        }

        var fileName = args[0];
        if (fileName) {
            var parent = terminal._currentFolder.path;

            var fullPath = [parent, fileName].join('/');
            fu.saveFile(fullPath, manager, '', function() {
                terminal._treebeard.addFile(fullPath);
                manager.action('UPDATE_TREE_FILE', [fullPath]);
                terminal.printLine(['File:', fullPath, 'created!'].join(' '));
                done();
            });
        } else {
            terminal.printLine('You must inform a file name');
            done();
        }
    }
}
module.exports = command;