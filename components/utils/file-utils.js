fs = require('fs');

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

module.exports = new FileUtils();