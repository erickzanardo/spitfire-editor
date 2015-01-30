function Assert() {}

Assert.prototype.eq = function(expected, actual, message) {
    console.log(message, expected == actual ? ' PASS ': ' FAIL ');
};

Assert.prototype.isTrue = function(actual, message) {
    console.log(message, actual ? ' PASS ': ' FAIL ');
};

module.exports = new Assert();