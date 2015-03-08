var command = {
    name: 'echo',
    func: function(args, terminal, manager, done){
        terminal.printLine(args.join(' '));
        done();
    }
}
module.exports = command;