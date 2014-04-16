// module.exports = {
// 	Clock			: require('./lib/Clock'),
// 	Engine 			: require('./lib/Engine'),
// 	Entity 			: require('./lib/Entity'),
// 	EntityManager 	: require('./lib/EntityManager'),
// 	System 			: require('./lib/System'),
// 	World 			: require('./lib/World')
// };

var watcher = require('./server/watcher');

console.log("watching...");

watcher(__dirname + '/example');
