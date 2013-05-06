fd = {
  createFeatureSet: function() {
    return {
      component : [],
      system    : [],
      category  : [],
      event     : []
    };
  }
};

(function() {
  
  function constant(name, value) {
    Object.defineProperty(fd, name, {
      value: value,
      enumerable: true,
      writable: false
    });
  }
  
  function featureType(key, id, title) {
    var featureType = {};
    
    Object.defineProperty(featureType, 'id', {
      value: id,
      enumerable: true,
      writable: false
    });
    
    Object.defineProperty(featureType, 'title', {
      value: title,
      enumerable: true,
      writable: false
    });
    
    featureType.toString = function() { return id; }
    
    constant(key, featureType);
  }
  
  featureType('COMPONENT',  'component',  'Component');
  featureType('SYSTEM',     'system',     'System');
  featureType('CATEGORY',   'category',   'Event Category');
  featureType('EVENT',      'event',      'Event');
  
})();
