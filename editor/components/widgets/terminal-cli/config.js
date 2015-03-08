var command = {
    name: 'config',
    func: function(args, terminal, manager, done) {
        var config = args[0];
        var configObject = manager.config;
    
        if (configObject[config] === undefined) {
            terminal.printLine('There is no config named: ' + config);
        } else {
            // Removing the config key from the args
            args.splice(0, 1);
            if (args.length) {
                if (typeof(configObject[config]) === 'object') {
                    if (args.indexOf('-a') != -1) {
                        var i = args.indexOf('-a');
                        args.splice(i, 1);
                        configObject[config].push(args[0]);
                    } else if(args.indexOf('-d') != -1) {
                        var i = args.indexOf('-d');
                        args.splice(i, 1);

                        i = configObject[config].indexOf(args[0]);
                        configObject[config].splice(i, 1);
                    }
                } else {
                    configObject[config] = args[0];
                }
                manager.saveConfigs();
            } else {
                terminal.printLine(configObject[config]);
            }
        }
        done();
    }
};
module.exports = command;