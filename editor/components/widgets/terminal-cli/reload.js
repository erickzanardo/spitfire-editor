var command = {
    name: 'reload',
    func: function(args, terminal, manager, done) {
      var path = terminal._currentFolder.path;
      terminal.executeCommand(['openfolder', path].join(' '));
      done();
    }
}
module.exports = command;