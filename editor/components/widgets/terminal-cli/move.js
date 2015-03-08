var rk = require('rekuire');
var fu = rk('components/utils/file-utils.js');

var command = {
    name: 'mv',
    func: function(args, terminal, manager, done) {
        // TODO this verification can be turned in a function, cause a lot of file commands use this
        if (terminal._treebeard) {
            var path = args[0];
            var srcPath = terminal.buildFullPath(path);
            var node = terminal._treebeard.find(srcPath);
            if (!node) {
                terminal.printLine('Can\'t find ' + path);
                done();
            } else {
                var destPath = args[1];
                if (destPath) {
                    destPath = terminal.buildFullPath(destPath);
                    fu.move(srcPath, destPath, function(err) {
                        if (err) {
                            terminal.printLine(err);
                        } else {
                            terminal._treebeard.move(srcPath, destPath);
                            manager.action('UPDATE_TREE_MOVE_NODE', [srcPath, destPath]);
                        }
                        done();
                    });
                } else {
                    done();
                }
            }
        } else {
            terminal.printLine('There is no folder open yet!');
            done();
        }
    }
}
module.exports = command;