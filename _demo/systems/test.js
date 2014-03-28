system.title = 'Test';
system.requiredComponents = ['physics', 'position'];
system.eventCategories = ['physics'];

system.reset = function() {
  
}

system.restore = function() {
  
}

system.snapshot = function() {
  
}

system.update = function(time) {
  
}

system.handleEvent = function(type, event) {
  switch (type) {
    case events.COLLISION:
      console.log("collision detected!")
      break;
    default:
      console.log("unknown message!");
      break;
  }
}