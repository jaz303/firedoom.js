;(function() {
  
  var fieldTypeManager = fd.fieldTypeManager;
  
  function Component() {
    this.fields = {};
    this.defaults = {};
  }
  
  Component.prototype = {
    add: function(fieldName, fieldType, defaultValue) {
      if (fieldName == '__type')  
        throw "the field name '__type' is reserved";
      if (fieldName in this.fields)
        throw "duplicate field '" + fieldName + "' in component";
      if (!fieldTypeManager.hasType(fieldType))
        throw "unknown field type '" + fieldType + "' in component";
      
      this.fields[fieldName] = fieldType;
      this.defaults[fieldName] = defaultValue;
    },
    
    // This is the default slow, generic way to create a component
    // You can optimise this in the future by inlining:
    // return {__type: this.type, position: new fd.Vec2, velocity: new fd.Vec2}
    create: function() {
      var object = {};
      object.__type = this.type;
      for (var k in this.fields) {
        object[k] = fieldTypeManager.createValue(this.fields[k], this.defaults[k]);
      }
      return object;
    }
  };
  
  Object.defineProperty(Component.prototype, 'featureType', {
    value       : fd.COMPONENT,
    enumerable  : true,
    writable    : false
  });
  
  fd.blueprint.Component = Component;
  
})();