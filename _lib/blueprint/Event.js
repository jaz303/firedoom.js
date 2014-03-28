;(function() {
  
  function Event() {
    this.categories = [];
    this.async = false;
  }
  
  Event.prototype = {
    
  };
  
  Object.defineProperty(Event.prototype, 'featureType', {
    value       : fd.EVENT,
    enumerable  : true,
    writable    : false
  });
  
  fd.blueprint.Event = Event;
  
})();