var fs = require('fs');
var mkdirp = require('mkdirp');

function FileUtils() {
}

FileUtils.prototype.readDirFiles = function(path, callback) {
    var me = this;
    fs.readdir(path.join('/'), function (err, files) {
        for (var i = 0 ; i < files.length ; i++) {
            var f = files[i];
            var thisPath = [].concat(path);
            thisPath = thisPath.concat(f);
            var pathStr = thisPath.join('/');
            var stats = fs.lstatSync(pathStr);
            if (!err && stats.isDirectory()) {
                me.readDirFiles(thisPath, callback);
            } else{
                callback(pathStr);
            }
        }
    });
};

FileUtils.prototype.readDirTree = function(path) {
    var tree = [];
    var dirs = fs.readdirSync(path.join('/'));
    for (var i = 0 ; i < dirs.length ; i++) {
        var thisPath = [].concat(path);

        thisPath.push(dirs[i]);
        var name = thisPath[thisPath.length - 1];
        var stats = fs.lstatSync(thisPath.join('/'));

        // Jumping hidden folders
        if (name.indexOf('.') == 0) continue;

        if (stats.isDirectory()) {
            var folder = {
                path: thisPath,
                name: name,
                tree: this.readDirTree(thisPath)
            }
            tree.push(folder);
        } else {
             var file = {
                path: thisPath,
                name: name
            }
            tree.push(file);
        }
    }
    return tree;
};

FileUtils.prototype.readFile = function(path, callback) {
    fs.readFile(path, 'utf-8', callback);
};

FileUtils.prototype.createDirs = function(path, callback) {
    mkdirp(path, function (err) {
        if (err) throw (err);
        else callback(path)
    });
}

module.exports = new FileUtils();