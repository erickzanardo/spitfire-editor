var command = {
    name: 'openfolder',
    func: function(args, terminal, manager, done) {
        if (args.length == 0) {
            terminal.printLine('No folder to open');
        } else {
            try {
                // TODO this is quite confusing :(
                terminal._treebeard = manager.action('OPEN_FOLDER', [args[0]]);
                manager.action('SET_FOLDER', [terminal._treebeard]);
                terminal._currentFolder = terminal.buildRootNode(terminal);
            } catch (e) {
                terminal.printLine(e);
            }
        }
        done();
    }
}
module.exports = command;