// module.exports = {
// 	Clock			: require('./lib/Clock'),
// 	Engine 			: require('./lib/Engine'),
// 	Entity 			: require('./lib/Entity'),
// 	EntityManager 	: require('./lib/EntityManager'),
// 	System 			: require('./lib/System'),
// 	World 			: require('./lib/World')
// };

// var watcher = require('./server/watcher');

//
// serving

var Server = require('ws').Server;
var wss = new Server({port: 8080, path: "/watcher"});

wss.broadcast = function(data) {
	for (var i in this.clients) {
		this.clients[i].send(data);
	}
}

wss.on('connection', function(socket) {
	console.log("client connected");
});

//
// watching

var watchr = require('watchr');

watchr.watch({
    path        : __dirname + '/example',
    persistent  : true,
    listeners   : {
        change: function(type, path, currStat, oldStat) {

        	var changeEvent = {
        		type: "fs.modified",
        		fsType: type,
        		path: path,
        		currStat: currStat,
        		oldStat: oldStat
        	};

        	var msg = new Buffer(JSON.stringify(changeEvent), 'utf8');

        	wss.broadcast(msg);

        	// wss.broadcast(JSON.stringify({
        	// 	type: "fs.modified",
        	// 	fsType: type,
        	// 	path: path,
        	// 	currStat: currStat,
        	// 	oldState: oldStat
        	// }));

        }
    }
});
