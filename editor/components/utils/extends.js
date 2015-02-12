var $ = require('../../core/libs/jquery-2.1.3.min.js');

function extend(father, son, prototype) {
    son.prototype = $.extend(prototype, father.prototype);
    son.prototype.constructor = son;
}

module.exports = extend;