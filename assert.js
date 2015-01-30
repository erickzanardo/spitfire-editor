function Assert() {}

Assert.prototype.eq = function(expected, actual, message) {
    console.log(message, expected == actual ? ' PASS ': ' FAIL ');
}

module.exports = new Assert();