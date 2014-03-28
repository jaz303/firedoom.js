system.title = 'Physics';
system.requiredComponents = ['physics', 'position'];

system.reset = function() {
  
}

system.restore = function() {
  
}

system.snapshot = function() {
  
}

system.update = function(time) {
  //this.sendLater(5000, events.COLLISION);
  this.sendAsync(events.COLLISION);
}
