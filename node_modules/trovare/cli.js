#!/usr/bin/env node
var Trovare = require('trovare');

var args = process.argv;
var cwd = process.cwd();

var searchTerm = args.pop();

var trovare = new Trovare(cwd, searchTerm);
trovare.search(function(result) {
    console.log(' File: ' + result.file + ': ' + result.lineNumber);
    console.log(' Line: ' + result.line);
    console.log('  ');
});