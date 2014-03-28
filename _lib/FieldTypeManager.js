;(function() {
  
  // FieldTypeManager declares all available types of component fields.
  // In the future this can be expanded to support creation of custom
  // editor widgets for each field.
  
  var IDENTITY = function(x) { return x; }
  var Vec2 = fd.Vec2;
  
  function FieldTypeManager() {
    this.types = {};
  }

  FieldTypeManager.prototype = {
    register: function(typeName, attribs) {
      if (!('defaultValue' in attribs))
        throw "field type must declare a default value";
      attribs.clone = attribs.clone || IDENTITY;
      this.types[typeName] = attribs;
    },
    
    hasType: function(typeName) {
      return typeName in this.types;
    },
    
    createValue: function(type, defaultValue) {
      if (defaultValue === undefined)
        defaultValue = this.types[type].defaultValue;
      if (typeof defaultValue == 'function')
        defaultValue = defaultValue();
      
      return defaultValue;
    }
  };
  
  var manager = new FieldTypeManager;
  
  manager.register('number', {
    defaultValue: 0
  });
  
  manager.register('boolean', {
    defaultValue: false
  });
  
  manager.register('string', {
    defaultValue: ''
  });
  
  manager.register('vec2', {
    defaultValue: function() { return Vec2.zero(); },
    clone: Vec2.clone
  });
  
  // Array that only stores primitive values
  manager.register('primitiveArray', {
    defaultValue: [],
    clone: function(inArray) {
      var out = [];
      for (var i = 0; i < inArray.length; ++x) {
        out.push(inArray[i]);
      }
      return out;
    }
  });
  
  // Object that only stores primitive values
  manager.register('primitiveObject', {
    defaultValue: {},
    clone: function(inObject) {
      var out = {};
      for (var k in inObject) {
        out[k] = inObject[k];
      }
      return out;
    }
  });
  
  Object.defineProperty(fd, 'fieldTypeManager', {
    value: manager,
    writable: false
  });
  
})();