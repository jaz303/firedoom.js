module.exports = System;

function System() {
	this.world		= null;
	this.title 		= '';
	this.enabled 	= true;
	this.rank 		= 0;
	this.entities 	= {};
}

System.prototype.on = function(evt, handler) {

}

System.prototype.reset = function() {

}

System.prototype.prepare = function() {

}

System.prototype.teardown = function() {

}

System.prototype.acceptsEntity = function() {
	return false;
}

System.prototype.update = function(clock) {

}

System.prototype.entityAdded = function(entity) {

}

System.prototype.entityRemoved = function(entity) {

}

// TODO: save
// TODO: restore
// TODO: create snapshot
// TODO: install snapshot