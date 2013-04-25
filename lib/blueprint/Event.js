;(function() {
  
  function Event() {
    this.categories = [];
    this.async = false;
  }
  
  Event.prototype = {
    
  };
  
  Object.defineProperty(Event.prototype, 'type', {
    value: 'event',
    writable: false
  });
  
  fd.blueprint.Event = Event;
  
})();