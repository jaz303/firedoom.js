(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fd = require('../');

window.init = function() {
	
}
},{"../":2}],2:[function(require,module,exports){
module.exports = {
	Clock			: require('./lib/Clock'),
	Engine 			: require('./lib/Engine'),
	Entity 			: require('./lib/Entity'),
	EntityManager 	: require('./lib/EntityManager'),
	World 			: require('./lib/World')
};
},{"./lib/Clock":3,"./lib/Engine":4,"./lib/Entity":5,"./lib/EntityManager":6,"./lib/World":7}],3:[function(require,module,exports){
module.exports = Clock;

function Clock() {
	this.reset();
}

Clock.prototype.tick = function(delta) {
	this.time += delta;
	this.delta = delta;
}

Clock.prototype.reset = function() {
	this.time = 0;
	this.delta = null;
}
},{}],4:[function(require,module,exports){
module.exports = Engine;

var World = require('./World');

function Engine(opts) {

    opts = opts || {};

    this._logger = opts.logger || console;

    this.world = new World(logger);

}
},{"./World":7}],5:[function(require,module,exports){
module.exports = Entity;

function Entity(id) {
    this.id = id;
    this.uniqId = null;
}

Entity.prototype.toString = function() {
    return "<Entity id=" + this.id + " unique-id=" + this.uniqId + ">";
}
},{}],6:[function(require,module,exports){
module.exports = EntityManager;

var Entity = require('./Entity');

function EntityManager(world) {
	this.world = world;
	this.activeEntities = [];
	this.recycledEntities = [];
	this.nextAvailableId = 1;
	this.nextUniqueEntityId = 1;
	this.length = 0;
	this.totalCreated = 0;
	this.totalDestroyed = 0;
}

EntityManager.prototype.create = function() {

	var entity = this.recycledEntities.pop();
	
	if (!entity) {
		entity = new Entity(this.nextAvailableId++);
	}
	
	entity.uniqId = this.nextUniqueEntityId++;

	this.activeEntities[entity.id] = entity;

	this.length++;
	this.totalCreated++;

	return entity;

}

EntityManager.prototype.destroy = function(entity) {

	this.activeEntities[entity.id] = null;

	// TODO: teardown entity (type bits, components etc)

	this.length--;
	this.totalDestroyed++;

	this.recycledEntities.push(entity);

}
},{"./Entity":5}],7:[function(require,module,exports){
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
},{"./EntityManager":6}]},{},[1])