;(function() {
  
  var PREAMBLE = "(function(#var, events) {\n\"use strict\";\n";
  var POSTAMBLE = "\n})";
  
  function compile(ctor, id, name, code) {
    var thing = new ctor;
    Object.defineProperty(thing, 'id', {value: id, writeable: false});
    try {
      var maker = eval(PREAMBLE.replace('#var', name) + code + POSTAMBLE);
      maker(thing, fd.events);
      return thing;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  
  function Registry() {
    this._features          = fd.createFeatureSet();
    this._modifiedFeatures  = fd.createFeatureSet();
    this._removedFeatures   = fd.createFeatureSet();
  };
  
  Registry.prototype = {
    setEnvironment: function(env) { this.env = env; },
    setWorld: function(world) { this.world = world; },
    
    compile: function() {
      var compiler = new fd.Compiler;
      
      compiler.setEnvironment(this.env);
      compiler.setWorld(this.world);
      compiler.setFeatures(this._features,
                           this._modifiedFeatures,
                           this._removedFeatures);
      
      var result = compiler.compile();
      
      this._modifiedFeatures  = fd.createFeatureSet();
      this._removedFeatures   = fd.createFeatureSet();
      
      if (result.success) {
        this._features = result.features;
      } else {
        
      }
      
      return result;
    },
    
    add: function(thing) { this._modifiedFeatures[thing.type].push(thing); },
    remove: function(thing) { this._removedFeatures[thing.type].push(thing); },
    
    create: function(type, id, code) {
      switch (type) {
        case 'component':   return this.createComponent(id, code);
        case 'system':      return this.createSystem(id, code);
        case 'category':    return this.createEventCategory(id, code);
        case 'event':       return this.createEvent(id, code);
        default:            throw "unknown thing type: " + type;
      }
    },
    
    createComponent: function(id, code) {
      return compile(fd.blueprint.Component, id, 'cmp', code);
    },
    
    createSystem: function(id, code) {
      return compile(fd.blueprint.System, id, 'system', code);
    },
    
    createEventCategory: function(id, code) {
      return compile(fd.blueprint.EventCategory, id, 'category', code);
    },
    
    createEvent: function(id, code) {
      return compile(fd.blueprint.Event, id, 'event', code);
    }
  };
  
  fd.Registry = Registry;
  
})();