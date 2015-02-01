var extend = require('../utils/extends.js');
var Widget = require('./widget.js');
var GlyphButton = require('./glyph-button.js');
var $ = require('../../core/libs/jquery-2.1.3.min.js');

function ToolBar(tabEditor){
    Widget.call(this);
    this._element = $('<div class="se-toolbar"><ul class="list-inline"></ul></div>');
    this._tabEditor = tabEditor;
}

extend(Widget, ToolBar, {
    addCommand: function(element) {
        var li = $('<li></li>');
        li.append(element.element());
        this._element.find('ul').append(li);
    },
    buildDefault: function() {
        var save = new GlyphButton('glyphicon-floppy-save', 'Save');

        var me = this;

        save.click(function() {
            me._tabEditor.saveCurrentFile();
        });
        this.addCommand(save);
        
        var saveAll = new GlyphButton('glyphicon-save-file', 'Save all');
        saveAll.click(function() {
            me._tabEditor.saveAllFiles();
        });
        this.addCommand(saveAll);
    }
});

ToolBar.prototype.constructor = ToolBar;

module.exports = ToolBar;