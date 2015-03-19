var command = {
    name: 'open',
    func: function(args, terminal, manager, done) {
        var file = args[0];
        var path = [terminal._currentFolder.path, file].join('/');
        if (terminal._treebeard.find(path)) {
            terminal._tabEditor.openFile(file, path);
        } else {
            terminal.printLine('Can\'t find: ' + path);
        }
        done();
    }
}
module.exports = command;