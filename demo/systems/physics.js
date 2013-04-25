system.title = 'Physics';
system.requiredComponents = ['physics', 'position'];

system.reset = function() {
  
}

system.restore = function() {
  
}

system.snapshot = function() {
  
}

system.update = function(time) {
  this.sendLater(1000, events.COLLISION);
}
