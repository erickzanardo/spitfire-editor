var Root = require('./components/widgets/root.js');

function SpitfireEditor() {
}

SpitfireEditor.prototype.init = function(gui, root, spitfireManager) {
    this.gui = gui;
    this.root = new Root(root);
    var args = this.gui.App.fullArgv;

    var entryFile = 'main.js';
    for (var i = 0 ; i < args.length ; i++) {
        var arg = args[i];
        if (arg.indexOf('--test-file=') != -1) {
            entryFile = arg.split('=')[1];
        }
    }

    var entry = require('./' + entryFile);
    entry.init(gui, this.root, spitfireManager);
};

module.exports = new SpitfireEditor();