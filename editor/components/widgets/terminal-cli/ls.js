var command = {
    name: 'ls',
    func: function(args, terminal, manager, done) {
        if (terminal._currentFolder) {
            var tree = terminal._currentFolder.tree;
            var result = [];
            for (var i = 0 ; i < tree.length ; i++) {
                var node = tree[i];
                result.push(node.name);
            }
            terminal.printLine(result.join(' '));
        } else {
            terminal.printLine('There is no folder open yet!');
        }
        done();
    }
}
module.exports = command;