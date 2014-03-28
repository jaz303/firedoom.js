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