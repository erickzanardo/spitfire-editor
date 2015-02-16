var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');

function Terminal(gui, manager){
    Widget.call(this);
    this._element = $('<div class="se-terminal"></div>');
    this._focus = false;
    this._lines = [];
    this._treebeard = null;
    this._currentFolder = null;
    this._history = [];
    this._historyIndex = 0;
    this._manager = manager;

    var savedHistory = manager.localDb().get('COMMAND_HISTORY');
    if (savedHistory) {
        this._history = savedHistory;
    }

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
    
    var searchNodeOnTree = function(tree, name) {
        for (var i = 0; i < tree.length; i++) {
            var node = tree[i];
            if (node.name == name) {
                return node;
            }
        }
        return false;
    };
    
    var buildFullPath = function(path) {
        var basePath = me._currentFolder.path;
        var fullPath = [basePath, path].join('/');
        return fullPath;
    };
    
    var buildRootNode = function(me) {
        return {name: '~', tree: me._treebeard.tree(), path: me._treebeard._home};
    };
    
    this._commands = {
        config: function(args, terminal, done) {
            var config = args[0];
            var configObject = manager.config;
            if (configObject[config] === undefined) {
                terminal.printLine('There is no config named: ' + config);
            } else {
                if (args[1]) {
                    configObject[config] = args[1];
                    manager.saveConfigs();
                } else {
                    terminal.printLine(configObject[config]);
                }
            }
            done();
        },
        exit: function(args, terminal, done) {
            gui.App.quit();
        },
        mv: function(args, terminal, done) {
            // TODO this verification can be turned in a function, cause a lot of file commands use this
            if (me._treebeard) {
                var path = args[0];
                var srcPath = buildFullPath(path);
                var node = me._treebeard.find(srcPath);
                if (!node) {
                    terminal.printLine('Can\'t find ' + path);
                    done();
                } else {
                    var destPath = args[1];
                    if (destPath) {
                        destPath = buildFullPath(destPath);
                        fu.move(srcPath, destPath, function(err) {
                            if (err) {
                                terminal.printLine(err);
                            } else {
                                me._treebeard.move(srcPath, destPath);
                                manager.action('UPDATE_TREE_MOVE_NODE', [srcPath, destPath]);
                            }
                            done();
                        });
                    } else {
                        done();
                    }
                }
            } else {
                terminal.printLine('There is no folder open yet!');
                done();
            }
        },
        rm: function(args, terminal, done) {
            if (me._treebeard) {
                var path = args[0];
                var node = me._treebeard.find(buildFullPath(path));
                if (!node) {
                    terminal.printLine('Can\'t find ' + path);
                    done();
                } else {
                    var f = node.tree ? 'removeDir' : 'removeFile';
                    var treebeardRemove = node.tree ? 'removeFolder' : 'removeFile';
                    fu[f](node.path, function() {
                        manager.action('UPDATE_TREE_REMOVE_NODE', [node]);
                        me._treebeard[treebeardRemove](node.path);
                        done();
                    });
                }
            } else {
                terminal.printLine('There is no folder open yet!');
                done();
            }
        },
        echo: function(args, terminal, done){
            terminal.printLine(args.join(' '));
            done();
        },
        openfolder: function(args, terminal, done) {
            if (args.length == 0) {
                terminal.printLine('No folder to open');
            } else {
                try {
                    me._treebeard = manager.action('OPEN_FOLDER', [args[0]]);
                    me._currentFolder = buildRootNode(me);
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
                var parent = me._treebeard.findParent(me._currentFolder.path);
                if (parent) {
                    me._currentFolder = parent;
                } else {
                    me._currentFolder = buildRootNode(me);
                }
            } else {
                var tree = me._currentFolder.tree;
                for (var i = 0 ; i < tree.length ; i++) {
                    var node = tree[i];
                    if (node.name == folder) {
                        if (node.tree) {
                            me._currentFolder = node;
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
                done();
                return;
            }

            var path = args[0];
            var basePath = me._currentFolder.path;
            var fullPath = [basePath, path].join('/');

            var treebeard = me._treebeard;
            fu.createDirs(fullPath, function(fullPath) {
                treebeard.addFolder(fullPath);

                manager.action('UPDATE_TREE_FOLDERS', [fullPath]);
                terminal.printLine(fullPath + ' created!')
                done();
            });
        },
        touch: function(args, terminal, done) {
            if (!me._currentFolder) {
                terminal.printLine('There is no folder open yet!');
                done();
                return;
            }

            var fileName = args[0];
            if (fileName) {
                var parent = me._currentFolder.path;

                var fullPath = [parent, fileName].join('/');
                fu.saveFile(fullPath, me._manager, '', function() {
                    me._treebeard.addFile(fullPath);
                    manager.action('UPDATE_TREE_FILE', [fullPath]);
                    terminal.printLine(['File:', fullPath, 'created!'].join(' '));
                    done();
                });
            } else {
                terminal.printLine('You must inform a file name');
                done();
            }
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
            
            if (w == helperKeys.CONTROL_KEY) {
                // Don't know why, but this key mess with the terminal :(
                return;
            }

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
                    var history = line.find('.command').html();
                    var found = false;
                    for (var i = 0 ; i < me._history.length ; i++) {
                        if (me._history[i] == history) {
                            found = true;
                        }
                        break;
                    }
                    if (!found) {
                        me._history.unshift(history);
                        manager.localDb().save('COMMAND_HISTORY', me._history);
                    }
                    me._historyIndex = 0;
                } else {
                    me.printLine('unrecognized command: ' + command);
                    me.addLine();
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
            } else if (w == helperKeys.DOWN_KEY || w == helperKeys.UP_KEY) {
                var i = me._historyIndex;
                var history = me._history;

                if (history.length) {
                    var command = history[i];
                    line.find('.command').html(command);

                    if (w == helperKeys.UP_KEY) {
                        if (i == history.length - 1) {
                            i = 0;
                        } else {
                            i++;
                        }
                    } else {
                        if (i == 0) {
                            i = history.length - 1;
                        } else {
                            i--;
                        }
                    }
                    me._historyIndex = i;
                }
            } else {
                var char = (String.fromCharCode(w));
                line.find('.cursor').before(['<span>', char, '</span>'].join(''));
            }
            return false;
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
            var name = this._currentFolder.path;
            name = name.replace(this._treebeard._home, '~');
            var folderIndicator = $('<span class="folder-indicator"></span>');
            folderIndicator.text(name);
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