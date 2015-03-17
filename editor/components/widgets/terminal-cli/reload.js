var command = {
    name: 'reload',
    func: function(args, terminal, manager, done) {
      var path = terminal._currentFolder.path;
      terminal.executeCommand(['openfolder', path].join(' '), function() {
        terminal.printLine('Reloaded!');
        done();
      });
    }
}
module.exports = command;