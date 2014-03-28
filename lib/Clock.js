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