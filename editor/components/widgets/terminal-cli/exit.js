var command = {
    name: 'exit',
    func: function(args, terminal, manager, done) {
        manager.gui().App.quit();
    }
}
module.exports = command;