var SplitPanel = require('./components/widgets/split-panel.js');
var Panel = require('./components/widgets/panel.js');
var NavigationTree = require('./components/widgets/navigation-tree.js');
var TabEditor = require('./components/widgets/tab-editor.js');
var AceEditor = require('./components/widgets/ace-editor.js');
var Terminal = require('./components/widgets/terminal.js');
var FileSearch = require('./components/widgets/file-search.js');

var $ = require('./core/libs/jquery-2.1.3.min.js');

var rk = require('rekuire');
var workspaceManager = rk('workspace-manager.js');
var configurationManager = rk('configuration-manager.js');

function EditorEntry() {}

EditorEntry.prototype.init = function(gui, root, manager) {
    workspaceManager.init(manager);
    configurationManager.init(manager);
  
    // Get the current window
    var nwin = gui.Window.get();
    nwin.maximize();

    // Clear loading properties
    root.element().html('');

    // Main panel contains the coding panel por navigation and ace editor and the terminal
    var mainPanel = new SplitPanel();
    mainPanel.horizontal(true);
    mainPanel.fixedSize(true);
    mainPanel.appendTo(root);

    var codePanel = new SplitPanel();
    codePanel.fixedSize(true);
    mainPanel.add(codePanel, 80);

    var rightPanel = new Panel();
    var tabEditor = new TabEditor(gui, 1, manager);
    tabEditor.appendTo(rightPanel);

    var leftPanel = new Panel();
    var navigationTree = new NavigationTree(tabEditor, manager);
    navigationTree.appendTo(leftPanel);

    codePanel.add(leftPanel, 20);
    codePanel.add(rightPanel, 80);
    
    var terminal = new Terminal(gui, manager, tabEditor);
    mainPanel.add(terminal, 20);

    var fileSearch = new FileSearch(manager, tabEditor);
    fileSearch.appendTo(root);

    manager.registerFocusable(fileSearch, true);
    manager.registerFocusable(terminal);
    manager.registerFocusable(navigationTree);
    manager.registerFocusable(tabEditor);

    manager.registerShortcut('ctrl+shift+o', function(e) {
        manager.focusOn(fileSearch);
        e.preventDefault();
    });

    manager.registerShortcut('esc', function(e) {
        manager.focusOn(terminal);
        e.preventDefault();
    });

    manager.registerShortcut('ctrl+n', function(e) {
        manager.focusOn(navigationTree);
        e.preventDefault();
    });

    manager.registerShortcut('ctrl+e', function(e) {
        manager.focusOn(tabEditor);
        e.preventDefault();
    });

    manager.registerShortcut('ctrl+shift+c', function(e) {
        manager.focusOn(tabEditor);
        e.preventDefault();
    });
}

module.exports = new EditorEntry();