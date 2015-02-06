var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function Terminal(gui, manager){
    Widget.call(this);
    this._element = $('<div class="se-terminal"></div>');
    this._focus = false;
    this._lines = [];
    this._tree = [];
    this._currentFolder = null;

    var me = this;
    manager.registerShortcut('ctrl+c', function(e) {
        if (me.hasFocus()) {
            var lines = me._lines;
            if (lines.length) {
                var line = lines[lines.length - 1];
                line.find('.cursor').removeClass('cursor');
                me.addLine();
            }
            e.preventDefault();
        }
    });

    manager.registerShortcut('shift+ins', function(e) {
        if (me.hasFocus()) {
            var lines = me._lines;
            if (lines.length) {
                var line = lines[lines.length - 1];
                var clipboard = gui.Clipboard.get();
                var text = clipboard.get('text');
                var letters = text.split('');

                var cursor = line.find('.cursor');
                for (var i = 0; i < letters.length; i++) {
                    var letter = letters[i];
                    cursor.before(['<span>', letter, '</span>'].join(''));
                }
            }
            e.preventDefault();
        }
    });
    
    this._commands = {
        echo: function(args, terminal, done){
            terminal.printLine(args.join(' '));
            done();
        },
        openfolder: function(args, terminal, done) {
            if (args.length == 0) {
                terminal.printLine('No folder to open');
            } else {
                try {
                    me._tree = manager.action('OPEN_FOLDER', args[0]);
                    me._currentFolder = {name: '~', tree: me._tree, path: args[0]};
                } catch (e) {
                    terminal.printLine(e);
                }
            }
            done();
        },
        ls: function(args, terminal, done) {
            if (me._currentFolder) {
                var tree = me._currentFolder.tree;
                var result = [];
                for (var i = 0 ; i < tree.length ; i++) {
                    var node = tree[i];
                    result.push(node.name);
                }
                terminal.printLine(result.join(' '));
            } else {
                terminal.printLine('There is no folder open yet!');
            }
            done();
        },
        cd: function(args, terminal, done) {
            var folder = args[0];

            if (!me._currentFolder) {
                terminal.printLine('There is no folder open yet!');
                done();
                return;
            }

            if (folder == '..') {
                if (me._currentFolder.parent) {
                    me._currentFolder = me._currentFolder.parent;
                }
            } else {
                var tree = me._currentFolder.tree;
                for (var i = 0 ; i < tree.length ; i++) {
                    var node = tree[i];
                    if (node.name == folder) {
                        if (node.tree) {
                            me._currentFolder = {name: [me._currentFolder.name, node.name].join('/'),
                                                 tree: node.tree, parent: me._currentFolder,
                                                 path: node.path};
                        } else {
                            terminal.printLine([node.name, 'is not a folder'].join(' '));
                        }
                        done();
                        return;
                    }
                }
                terminal.printLine([folder, 'not found'].join(' '));
            }
            done();
        },
        mkdir: function(args, terminal, done) {
            if (!me._currentFolder) {
                terminal.printLine('There is no folder open yet!');
                return;
            }

            var path = args[0];
            var basePath = me._currentFolder.path;
            var fullPath = [me._currentFolder.path, '/', path].join('');
            basePath = basePath.split('/');
            fu.createDirs(fullPath, function(fullPath) {
                var folders = path.split('/');
                var tree = me._tree;
                var newFolders = [];

                while (folders.length) {
                    var folder = folders[0];
                    var found = false;
                    for (var i = 0; i < tree.length; i++) {
                        var node = tree[i];
                        if (node.name == folder) {
                            // Already created move on
                            basePath.push(folder);
                            folders.shift();
                            tree = node.tree;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        folders.shift();
                        var parent = basePath.join('/');
                        basePath.push(folder);

                        var newFolder = {
                            name: folder,
                            path: [].concat(basePath),
                            tree: []
                        }
                        newFolders.push({
                            parent: parent,
                            node: newFolder
                        });
                        tree.push(newFolder);
                        tree = newFolder.tree;
                    }
                }

                manager.action('UPDATE_TREE_FOLDERS', newFolders);
                terminal.printLine(fullPath + ' created!')
                done();
            });
        }
    };
    this.addLine();

    var keyManager = manager.keyManager();
    var helperKeys = keyManager.helperKeys;
    
    manager.addInputListener(function(e) {
        if (me.hasFocus()) {
            var w = e.which;

            var lines = me._lines;
            var line = lines[lines.length - 1]
            if (w == helperKeys.ENTER_KEY) {
                line.find('.cursor').removeClass('cursor');
                var commandLine = line.find('.command').text();
                var split = commandLine.split(' ');
                var args = [];
                for (var i = 0 ; i < split.length ; i++) {
                    var arg = split[i];
                    if (arg) {
                        args.push(arg);
                    }
                }
                
                var command = args.shift();

                if (me._commands[command]) {
                    me._commands[command](args, me, function() {
                        me.addLine();
                    });
                } else {
                    me.printLine('unrecognized command: ' + command);
                }
            } else if (w == helperKeys.BACKSPACE_KEY) {
                line.find('.cursor').prev().remove();
            } else if (w == helperKeys.LEFT_KEY || w == helperKeys.RIGHT_KEY) {
                var commandLength = line.text().length;
                var c = line.find('.cursor');
                var newCursor = (w == helperKeys.LEFT_KEY ? newCursor = c.prev() : newCursor = c.next());
                var cursorIndex = newCursor.index();
                if (cursorIndex >= 0 && cursorIndex <= commandLength) {
                    c.removeClass('cursor');
                    newCursor.addClass('cursor');
                }
            } else {
                var char = (String.fromCharCode(w));
                line.find('.cursor').before(['<span>', char, '</span>'].join(''));
            }

        }
        return true;
    });
}

extend(Widget, Terminal, {
    hasFocus: function() {
        return this._focus;
    },
    focus: function(focus) {
        this._focus = focus;
        if (focus) {
            this._element.addClass('active');
        } else {
            this._element.removeClass('active');
        }
    },
    addLine: function() {
        var line = $('<p class="line"></p>');
        line.append('<div class="command"><span class="cursor"></span></div>')
        if (this._currentFolder) {
            var folderIndicator = $('<span class="folder-indicator"></span>');
            folderIndicator.text(this._currentFolder.name);
            line.prepend(folderIndicator);
        }
        line = line.appendTo(this._element);
        this._lines.push(line);
        this.moveBottom();
    },
    printLine: function(value) {
        var line = $('<p class="line"></p>');
        line.text(value);
        line.appendTo(this._element);
        this.moveBottom();
    },
    moveBottom: function() {
        var terminal = this._element;
        terminal.animate({ scrollTop: terminal.prop("scrollHeight") }, 500);
    }
});

Terminal.prototype.constructor = Terminal;

module.exports = Terminal;