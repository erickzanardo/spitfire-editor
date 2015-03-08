var rk = require('rekuire');
var fu = rk('components/utils/file-utils.js');

var command = {
    name: 'rm',
    func: function(args, terminal, manager, done) {
        if (terminal._treebeard) {
            var path = args[0];
            var node = terminal._treebeard.find(terminal.buildFullPath(path));
            if (!node) {
                terminal.printLine('Can\'t find ' + path);
                done();
            } else {
                var f = node.tree ? 'removeDir' : 'removeFile';
                var treebeardRemove = node.tree ? 'removeFolder' : 'removeFile';
                fu[f](node.path, function() {
                    manager.action('UPDATE_TREE_REMOVE_NODE', [node]);
                    terminal._treebeard[treebeardRemove](node.path);
                    done();
                });
            }
        } else {
            terminal.printLine('There is no folder open yet!');
            done();
        }
    }
}
module.exports = command;