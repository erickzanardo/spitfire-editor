var command = {
    name: 'workspace',
    func: function(args, terminal, manager, done) {
        terminal.printLine('Not implemented');
        done();

        if (args.indexOf('-s')) {
            if (!terminal._currentFolder) {
                terminal.printLine('There is no folder open yet!');
                done();
                return;
            }
        }
        
    }
}
module.exports = command;