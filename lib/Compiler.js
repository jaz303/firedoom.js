;(function() {
  
  function toConstCase(str) {
    return str.toUpperCase();
  }
  
  function Compiler() {}
  
  Compiler.prototype = {
    setEnvironment: function(env) { this.env = env; },
    setWorld: function(world) { this.world = world; },
    
    setFeatures: function(existingFeatures, modifiedFeatures, removedFeatures) {
      this._existing  = existingFeatures;
      this._modified  = modifiedFeatures;
      this._removed   = removedFeatures;
    },
    
    compile: function() {
      
      var self = this;
      
      this.result = {success: true};
      this.features = fd.createFeatureSet();
      
      try {
        
        this._compileEventCategories();
        this._compileEvents();
        this._compileSystems();
        this._updateGlobalEventMasks();
        
        this.result.features = this.features;
        
        this.world.setSystems(this.features.system);
        
      } catch (e) {
        
        this.result.success = false;
      
      }
      
      return this.result;
    
    },
    
    _compileEventCategories: function() {
      
      // TODO: don't do any work if nothing has changed
      // (need to stash the value of nextCategory somewhere it can be retrieved)
      
      var categories = {};
      
      this._existing.category.forEach(function(c) { categories[c.id] = c; });
      this._modified.category.forEach(function(c) { categories[c.id] = c; });
      this._removed.category.forEach(function(c) { delete categories[c.id]; });
      
      var nextCategory  = 1 << 31,
          categoryMask  = 0;
          
      for (var k in categories) {
        categoryMask |= nextCategory;
        categories[k].bit = nextCategory;
        nextCategory >>= 1;
        this.features.category.push(categories[k]);
      }
      
      this._categories = categories;
      this._categoryMask = categoryMask;
      this._lastCategory = nextCategory << 1;
      
    },
    
    _compileEvents: function() {
      
      var events = {};
      
      this._existing.event.forEach(function(e) { events[e.id] = e; });
      this._modified.event.forEach(function(e) { events[e.id] = e; });
      this._removed.event.forEach(function(e) { delete events[e.id]; });
      
      var nextEvent   = 1,
          categories  = this._categories;
      
      for (var k in events) {
        
        if (nextEvent == this._lastCategory) {
          throw "event/category clash";
        }
        
        var event = events[k],
            code  = nextEvent++;
            
        event.categories.forEach(function(catId) {
          var cat = categories[catId];
          if (!cat) {
            console.log("warning! category ID '" + catId + "' does not exist.");
          } else {
            code |= cat.bit;
          }
        });
        
        event.code = code;
            
        this.features.event.push(event);
      
      }
      
    },
    
    _compileSystems: function() {
      var self = this;
      
      this.features.system = [].concat(this._modified.system);
      this.features.system.forEach(function(s) {
        s.eventCategoryMask = 0;
        s.eventCategories.forEach(function(c) {
          s.eventCategoryMask |= self._categories[c].bit;
        });
        
        s.setEnvironment(self.env);
        s.setWorld(self.world);
        s.prepare();
        s.reset();
      });
    },
    
    _updateGlobalEventMasks: function() {
      for (var k in fd.events) delete fd.events[k];
      
      var events      = this.features.event,
          categories  = this.features.category;

      events.forEach(function(evt) {
        fd.events[toConstCase(evt.id)] = evt.code;
        fd.eventAsync[evt.code] = evt.async;
      });

      categories.forEach(function(cat) {
        fd.events['CAT_' + toConstCase(cat.id)] = cat.bit;
      });
      
      fd.events.CATEGORY_MASK = this._categoryMask;
      fd.events.EVENT_MASK    = ~this._categoryMask;
    }
    
  }
  
  fd.Compiler = Compiler;
  
})();