var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');
var fu = require('../utils/file-utils.js');
var rk = require('rekuire');

var workspaceManager = rk('workspace-manager.js');
var configurationManager = rk('configuration-manager.js');

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
    
    var commands = [
        'config.js',
        'exit.js',
        'move.js',
        'remove.js',
        'echo.js',
        'openfolder.js',
        'ls.js',
        'cd.js',
        'mkdir.js',
        'touch.js',
        'reload.js',
        'workspace.js'
    ];
    this._commands = {};
    // register commands
    for (var i = 0; i < commands.length; i++) {
        var command = rk('components/widgets/terminal-cli/' + commands[i]);
        this._commands[command.name] = command.func;
    }
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
              me.executeCommand();
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
                    line.find('.command').children('span:last').addClass('cursor');

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

var parseCommand = function(command) {
    var result = [];
    var currentChar = '';
    var currentWord = '';
    var opennedQuote = false;
    for (var i = 0; i < command.length; i++) {
        currentChar = command[i];
        if (currentChar == '"') {
            opennedQuote = !opennedQuote;
        }
        if (!opennedQuote && currentChar == ' ') {
            result.push(currentWord);
            currentWord = '';
        } else {
            currentWord += currentChar;
        }
    }
    result.push(currentWord);
    return result;
};

extend(Widget, Terminal, {
  executeCommand: function(command, callback) {
      var me = this;
      var manager = me._manager;
      var lines = me._lines;
      var line = lines[lines.length - 1]

      var commandLine = command || line.find('.command').text();

          line.find('.cursor').removeClass('cursor');
          var split = parseCommand(commandLine);
          var args = [];
          for (var i = 0 ; i < split.length ; i++) {
              var arg = split[i];
              if (arg) {
                  args.push(arg);
              }
          }

          var done = callback || function() {
            me.addLine();
          };

          var command = args.shift();

          var addCommandToHistory = function() {
              var history = commandLine;
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
          };

          if (me._commands[command]) {
              me._commands[command](args, me, manager, done);
              addCommandToHistory();
          } else {
              var nativeCommands = configurationManager.get('trustedNativeCommands');
              if (nativeCommands.indexOf(command) != -1) {
                  if (me._currentFolder) {
                    addCommandToHistory();
                    line.append('<pre></pre>');
                    var spawn = require('child_process').spawn,
                        cmd   = spawn(command, args, {cwd: me._currentFolder.path});

                    cmd.stdout.on('data', function (data) {
                      line.children('pre').append('' + data);
                    });

                    cmd.stderr.on('data', function (data) {
                      line.children('pre').append('' + data);
                    });

                    cmd.on('close', done);
                  } else {
                    terminal.printLine('There is no folder open yet!');
                    done();
                  }
              } else {
                  me.printLine('unrecognized command: ' + command);
                  done();
              }
          }
  },
  searchNodeOnTree: function(tree, name) {
        for (var i = 0; i < tree.length; i++) {
            var node = tree[i];
            if (node.name == name) {
                return node;
            }
        }
        return false;
    },
    buildFullPath: function(path) {
        var basePath = this._currentFolder.path;
        var fullPath = [basePath, path].join('/');
        return fullPath;
    },
    buildRootNode: function(me) {
        return {name: '~', tree: this._treebeard.tree(), path: this._treebeard._home};
    },
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

            workspace = workspaceManager.currentWorkspace();
            if (workspace) {
              name = ['(', workspace.name() , ') ', name].join('');
            }

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