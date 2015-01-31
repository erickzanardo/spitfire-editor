var assert = require('../../assert.js');
var SplitPanel = require('../../components/widgets/split-panel.js');
var Panel = require('../../components/widgets/panel.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root) {

    var splitPanel = new SplitPanel();
    assert.isTrue(splitPanel.element().is('.se-split-panel-vertical'), 'Split panel is vertical by defaul');

    splitPanel.horizontal(true);
    assert.isTrue(splitPanel.element().is('.se-split-panel-horizontal'), 'Split panel must be horizontal when used horizontal function');

    splitPanel.add(new Panel());
    splitPanel.add(new Panel());

    assert.eq(2, splitPanel.children());
    assert.eq('50%', splitPanel.children()[0].element.element().css('height'), 'Elements must have 50% height when using a vertical panel with 2 children');
    assert.eq('50%', splitPanel.children()[1].element.element().css('height'), 'Elements must have 50% height when using a vertical panel with 2 children');

    splitPanel.horizontal(false);
    assert.eq('50%', splitPanel.children()[0].element.element().css('width'), 'Elements must have 50% width when using a vertical panel with 2 children');
    assert.eq('50%', splitPanel.children()[1].element.element().css('width'), 'Elements must have 50% width when using a vertical panel with 2 children');

    splitPanel.remove(0);
    assert.eq(1, splitPanel.children().length, 'Removing children from the panel');
    assert.eq('100%', splitPanel.children()[0].element.element().css('width'), 'Elements must have 100% width when using a vertical panel with 1 children');

    // Testing fixid size
    splitPanel.element().remove();
    splitPanel = new SplitPanel();
    splitPanel.fixedSize(true);

    splitPanel.add(new Panel(), 40);
    splitPanel.add(new Panel(), 60);

    assert.eq('40%', splitPanel.children()[0].element.element().css('width'), 'Elements must have the informad size when using fixedSize');
    assert.eq('60%', splitPanel.children()[1].element.element().css('width'), 'Elements must have the informad size when using fixedSize');

    gui.App.quit();
}

module.exports = new EditorEntry();