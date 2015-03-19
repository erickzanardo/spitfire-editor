# Trovare

Simple nodejs module to find a string recursively in a folder

## Install it
```
npm install trovare
```
or install it globally if you want to use it on the command-line
```
npm install trovare -g
```

## Usage

```javascript
var Trovare = require('trovare');
var trovare = new Trovare('/tmp/folder', 'node');

trovare.search(function(result) {
    console.log(' File: ' + result.file + ': ' + result.lineNumber);
    console.log(' Line: ' + result.line);
    console.log('  ');
});
```

## Terminal usage

Trovare will always use the current terminal folder as it's search path

```bash
# Single world serchTerm
trovare string-to-search
# Multi world serchTerm
trovare "string to search"
```
