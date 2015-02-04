var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

var ENTER_KEY = 13;
var BACKSPACE_KEY = 8;
var CONTROL_KEY = 18;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;

function Terminal(manager){
    Widget.call(this);
    this._element = $('<div class="se-terminal"></div>');
    this._focus = true; // TODO mudar
    this._lines = [];
    this._commands = {
        echo: function(args, terminal){
            terminal.printLine(args.join(' '));
        }
    };
    this.addLine();

    var me = this;
    manager.addInputListener(function(e) {
        if (me.hasFocus()) {
            var w = e.which;
            //console.log(w)

            var lines = me._lines;
            var line = lines[lines.length - 1]
            if (w == ENTER_KEY) {
                line.find('.cursor').removeClass('cursor');
                var commandLine = line.text();
                var split = commandLine.split(' ');
                var args = [];
                for (var i = 0 ; i < split.length ; i++) {
                    var arg = split[i];
                    if (arg) {
                        args.push(arg);
                    }
                }
                
                var command = args.shift();
                console.log(command);
                if (me._commands[command]) {
                    me._commands[command](args, me);
                } else {
                    me.printLine('unrecognized command: ' + command);
                }
                
                me.addLine();
            } else if (w == BACKSPACE_KEY) {
                line.find('.cursor').prev().remove();
            } else if (w == LEFT_KEY || w == RIGHT_KEY) {
                var commandLength = line.text().length;
                var c = line.find('.cursor');
                var newCursor = (w == LEFT_KEY ? newCursor = c.prev() : newCursor = c.next());
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
    },
    addLine: function() {
        var line = $('<p class="line"><span class="cursor"></span></line>');
        line = line.appendTo(this._element);
        this._lines.push(line);
    },
    printLine: function(value) {
        var line = $('<p class="line"></line>');
        line.text(value);
        line.appendTo(this._element);
    }
});

Terminal.prototype.constructor = Terminal;

module.exports = Terminal;