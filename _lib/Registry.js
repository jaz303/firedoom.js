;(function() {
  
  var PREAMBLE = "(function(#var, events, logger) {\n\"use strict\";\n";
  var POSTAMBLE = "\n})";
  
  function Registry(world) {
    this.world = world;
    
    this.features           = fd.createFeatureSet();
    this.modifiedFeatures   = fd.createFeatureSet();
    this.removedFeatures    = fd.createFeatureSet();
    
    this.compiled           = new Signal(this, 'compiled');
  };
  
  Registry.prototype = {
    getFeatures: function() {
      return this.features; // TODO: clone
    },
    
    getFeature: function(featureId) {
      
      var dot       = featureId.indexOf("."),
          major     = featureId.substr(0, dot),
          minor     = featureId.substr(dot + 1),
          features  = this.features[major];
          
      if (features) {
        for (var i = 0; i < features.length; ++i) {
          if (features[i].id == minor)
            return features[i];
        }
      }
      
      return null;
      
    },
    
    getSourceForFeature: function(featureId) {
      var feature = this.getFeature(featureId);
      return feature ? feature.__source : '';
    },
    
    compile: function() {
      var compiler = new fd.Compiler(this.world);
      compiler.setFeatures(this.features,
                           this.modifiedFeatures,
                           this.removedFeatures);
      
      var result = compiler.compile();
      
      this.modifiedFeatures   = fd.createFeatureSet();
      this.removedFeatures    = fd.createFeatureSet();
      
      if (result.success) {
        this.features = result.features;
        this.compiled.emit({
          success: true
        });
      } else {
        this.compiled.emit({
          success: false,
          errorType: 'compile',
          result: result
        });
      }
      
      return result;
    },
    
    add: function(thing) {
      if (!thing.id)
        throw "blueprint must have ID";
      
      this.modifiedFeatures[thing.featureType.id].push(thing);
    },
    
    remove: function(thing) {
      this.removedFeatures[thing.featureType.id].push(thing);
    },
    
    create: function(type, id, code) {
      switch (type) {
        case fd.COMPONENT   : return this.createComponent(id, code);
        case fd.SYSTEM      : return this.createSystem(id, code);
        case fd.CATEGORY    : return this.createEventCategory(id, code);
        case fd.EVENT       : return this.createEvent(id, code);
        default             : throw "unknown thing type: " + type;
      }
    },
    
    createComponent: function(id, code) {
      return this._compile(fd.blueprint.Component, id, 'cmp', code);
    },
    
    createSystem: function(id, code) {
      return this._compile(fd.blueprint.System, id, 'system', code);
    },
    
    createEventCategory: function(id, code) {
      return this._compile(fd.blueprint.EventCategory, id, 'category', code);
    },
    
    createEvent: function(id, code) {
      return this._compile(fd.blueprint.Event, id, 'event', code);
    },
    
    _compile: function(ctor, id, varName, code) {
      
      var thing = new ctor;
      Object.defineProperty(thing, 'id', {value: id, writeable: false});
      
      try {
        var maker = eval(PREAMBLE.replace('#var', varName) + code + POSTAMBLE);
      } catch (e) {
        this.compiled.emit({
          success: false,
          feature: thing,
          errorType: 'eval',
          error: e,
          source: code
        });
        return false;
      }
      
      try {
        maker(thing,
              this.world.lookup.events,
              this.world.getLogger());
      } catch (e) {
        this.compileFailed.emit({
          success: false,
          feature: thing,
          errorType: 'build',
          error: e,
          source: code
        });
        return false;
      }
      
      thing.__source = code;
      
      return thing;
    
    }
  };
  
  fd.Registry = Registry;
  
})();