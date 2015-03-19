var fs = require('fs');
var findit = require('findit');

function LineReader(path) {
    this.path = path;
    this.lineNumber = 0;
}

LineReader.prototype.read = function(onRead) {
    var input = fs.createReadStream(this.path);
    var remaining = '';
    var that = this;

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last  = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            that.lineNumber++;
            onRead(line, that);
            index = remaining.indexOf('\n', last);
        }
        remaining = remaining.substring(last);
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            onRead(remaining, that);
        }
    });
};

function Trovare(path, searchTerm) {
    this.path = path;
    this.searchTerm = searchTerm;
}

Trovare.prototype.search = function(hit) {
    var searchTerm = this.searchTerm;
    var finder = findit(this.path);
    finder.on('file', function (file, stat) {
        new LineReader(file).read(function(line, reader) {
            if (line.indexOf(searchTerm) != -1) {
                hit({
                    line: line,
                    lineNumber: reader.lineNumber,
                    file: reader.path
                });
            }
        });
    });
};

module.exports = Trovare;