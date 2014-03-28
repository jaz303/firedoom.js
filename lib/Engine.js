module.exports = Engine;

var World = require('./World');

function Engine(opts) {

    opts = opts || {};

    this._logger = opts.logger || console;

    this.world = new World(logger);

}