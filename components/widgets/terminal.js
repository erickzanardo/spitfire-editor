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
    this.addLine();

    var me = this;
    manager.addInputListener(function(e) {
        if (me.hasFocus()) {
            var w = e.which;
            console.log(w)
            
            var lines = me._lines;
            var line = lines[lines.length - 1]
            if (w == ENTER_KEY) {
                console.log(line.text());
                me.addLine();
            } else if (w == LEFT_KEY || w == RIGHT_KEY) {
                var c = line.find('.cursor');
                c.removeClass('cursor');
                var newCursor = w == LEFT_KEY ? newCursor = c.prev() : newCursor = c.next();
                if (newCursor) {
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
    }
    
});

Terminal.prototype.constructor = Terminal;

module.exports = Terminal;