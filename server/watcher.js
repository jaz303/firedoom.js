var fs = require('fs');

module.exports = function(sourcePath) {
    fs.watch(sourcePath, {persistent: true}, function(ev, filename) {
        console.log(ev, filename);
    });
}