;(function() {
  
  function EventCategory() {}
  
  EventCategory.prototype = {
    
  };
  
  Object.defineProperty(EventCategory.prototype, 'featureType', {
    value       : fd.CATEGORY,
    enumerable  : true,
    writable    : false
  });
  
  fd.blueprint.EventCategory = EventCategory;
  
})();