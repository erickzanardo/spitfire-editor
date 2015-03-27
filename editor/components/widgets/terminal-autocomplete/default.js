module.exports = {
    complete: function(terminal, command) {
        var result = [];
        var args = command.args;
        var folders = args.length ? args[0].split('/') : [''];
        var last = folders.pop();

        var currentFolder = terminal._currentFolder
        if (currentFolder) {
            var tree = currentFolder.tree;
            for (var i = 0; i < tree.length; i++) {
                var name = tree[i].name;
                if (name.indexOf(last) == 0) {
                    var parsedArgs = [].concat(folders);
                    parsedArgs.push(name);
                    var parsedArgsStr = parsedArgs.join('/');
                    result.push({
                        suggestion: name,
                        fullCommand: [command.command, parsedArgsStr].join(' ')
                    });
                }
            }
        }
        return result;
    }
};