var fs = require('fs');
var mkdirp = require('mkdirp');
var Ent = require('../../core/libs/ent.js')

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

FileUtils.prototype.readDirTree = function(path, treebeard) {
    treebeard = treebeard || new Ent(path);
    var tree = [];
    var dirs = fs.readdirSync(path);
    for (var i = 0 ; i < dirs.length; i++) {
        var thisPath = [].concat(path.split('/'));

        thisPath.push(dirs[i]);
        var name = thisPath[thisPath.length - 1];
        var stats = fs.lstatSync(thisPath.join('/'));

        // Jumping hidden folders
        if (name.indexOf('.') == 0) continue;

        var nodePath = thisPath.join('/');
        if (stats.isDirectory()) {
            treebeard.addFolder(nodePath);
            this.readDirTree(nodePath, treebeard);
        } else {
            treebeard.addFile(nodePath);
        }
    }
    return treebeard;
};

FileUtils.prototype.readFile = function(path, callback) {
    fs.readFile(path, 'utf-8', callback);
};

FileUtils.prototype.createDirs = function(path, callback) {
    mkdirp(path, function (err) {
        if (err) throw (err);
        else callback(path)
    });
};

FileUtils.prototype.saveFile = function(path, content, callback) {
    fs.writeFile(path, content, {encoding: 'utf-8'}, callback);
};

module.exports = new FileUtils();