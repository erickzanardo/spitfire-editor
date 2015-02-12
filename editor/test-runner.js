var fu = require('./components/utils/file-utils.js');
var exec = require('child_process').exec;

// TODO improve this, don't know why the output is on stderr
function puts(error, stdout, stderr) { console.log(stderr) };

var path = ['tests'];
fu.readDirFiles(path, function(file) {
    runTest(file);
});

var runTest = function(file) {
    var command = ['nw . --test-file=', file].join('');
    exec(command, puts);
}