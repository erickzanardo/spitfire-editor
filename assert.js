function Assert() {}

Assert.prototype.eq = function(expected, actual, message) {
    console.log(message, expected == actual ? ' PASS ': ' FAIL ', actual);
};

Assert.prototype.isTrue = function(actual, message) {
    console.log(message, actual ? ' PASS ': ' FAIL ', actual);
};

module.exports = new Assert();