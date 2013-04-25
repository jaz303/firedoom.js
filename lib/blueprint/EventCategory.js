;(function() {
  
  function EventCategory() {
    
  }
  
  EventCategory.prototype = {
    
  };
  
  Object.defineProperty(EventCategory.prototype, 'type', {
    value: 'category',
    writable: false
  });
  
  fd.blueprint.EventCategory = EventCategory;
  
})();