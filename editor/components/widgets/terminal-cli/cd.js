var command = {
    name: 'cd',
    func: function(args, terminal, manager, done) {
        var folder = args[0];

        if (!terminal._currentFolder) {
            terminal.printLine('There is no folder open yet!');
            done();
            return;
        }

        if (folder == '..') {
            var parent = terminal._treebeard.findParent(terminal._currentFolder.path);
            if (parent) {
                terminal._currentFolder = parent;
            } else {
                terminal._currentFolder = terminal.buildRootNode(terminal);
            }
          done();
        } else {
            var tree = terminal._currentFolder.tree;
            for (var i = 0 ; i < tree.length ; i++) {
                var node = tree[i];
                if (node.name == folder) {
                    if (node.tree) {
                        terminal._currentFolder = node;
                    } else {
                        terminal.printLine([node.name, 'is not a folder'].join(' '));
                    }
                    done();
                    return;
                }
            }
            terminal.printLine([folder, 'not found'].join(' '));
        }
        done();
    }
}
module.exports = command;