var watchr = require('watchr');

module.exports = function(sourcePath) {
    watchr.watch({
        path        : sourcePath,
        persistent  : true,
        listeners   : {
            change: function(type, path, currState, oldStat) {
                console.log('change: ', arguments);
            }
        }
    });
}