var rk = require('rekuire');

var Trovare = require('trovare');
var $ = rk('core/libs/jquery-2.1.3.min.js');

var resultLine = function() {
    return $(
       '<div class="panel panel-default">' +
        '   <div class="panel-heading"></div>' +
        '   <div class="panel-body">' +
        '       <a href=""></a>' +
        '   </div>' +
        '</div>'
    );
};

var command = {
    name: 'find',
    func: function(args, terminal, manager, done) {
        if (terminal._treebeard) {
            var search = args[0];
            var path = terminal._currentFolder.path;
            
            var body = $('<div></div>');
            var modal = manager.showPlainModal('Search result', body);
            
            body.on('click', 'a', function() {
                var path = $(this).attr('href');

                var split = path.split('/');
                var fileName = split[split.length - 1];
                terminal._tabEditor.openFile(fileName, path);

                modal.close();
                return false;
            });
            var trovare = new Trovare(path, search);
            trovare.search(function(result) {
                
                var line = resultLine();
                line.find('.panel-heading').text([result.file, result.lineNumber].join(':'));
                
                var a = line.find('a');
                a.attr('href', result.file);
                a.text(result.line);

                body.append(line);
            });
        } else {
            terminal.printLine('There is no folder open yet!');
        }
        done();
    }
}
module.exports = command;
