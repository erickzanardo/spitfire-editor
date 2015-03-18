var rk = require('rekuire');
var configurationManager = rk('configuration-manager.js');

var command = {
    name: 'config',
    func: function(args, terminal, manager, done) {
        var config = args[0];
    
        if (configurationManager.get(config) === undefined) {
            terminal.printLine('There is no config named: ' + config);
        } else {
            // Removing the config key from the args
            args.splice(0, 1);
            if (args.length) {
                var isObject = typeof(configurationManager.get(config)) === 'object';
                if (isObject) {
                    if (args.indexOf('-a') != -1) {
                        var i = args.indexOf('-a');
                        args.splice(i, 1);
                        var value = args[0];
                        
                        configurationManager.add(config, value);
                    } else if(args.indexOf('-d') != -1) {
                        var i = args.indexOf('-d');
                        args.splice(i, 1);

                        var value = args[0];
                        configurationManager.remove(config, value);
                    }
                } else {
                    var value = args[0];
                    configurationManager.set(config, value);
                }
            } else {
                terminal.printLine(configurationManager.get(config));
            }
        }
        done();
    }
};
module.exports = command;