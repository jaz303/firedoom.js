module.exports = World;

var EntityManager = require('./EntityManager');

function World(logger) {

	this.logger 		= logger;
	this.entityManager 	= new EntityManager(this);
	this.systems 		= [];
	this.added 			= [];
	this.removed 		= [];
	
}

World.prototype.tick = function() {

	var systems = this.systems,
		self 	= this;

	if (this.added.length) {
		this.added.forEach(function(e) {
			// TODO: associate world with entity?
			// TODO: present entity to each system
		}, this);
		this.added.splice(0, this.added.length);
	}

	if (this.removed.length) {
		this.removed.forEach(function(e) {
			// TODO: notify each system that entity has been removed
			this.entityManager.destroy(e);
		}, this);
		this.removed.splice(0, this.removed.length);
	}

	this.systems.forEach(function(s) {
		if (s.enabled) {
			s.update(this.clock);
		}
	}, this);

}

// add entity to the world; entity will be become active at the
// beginning of the next game tick.
World.prototype.spawn = function(entity) {
	this.added.push(entity);
}

// remove entity from the world; entity will be removed at the
// end of the current game tick
World.prototype.remove = function(entity) {
	this.removed.push(entity);
}