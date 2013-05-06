;(function() {
  
  function Compiler(world) {
    this.world = world;
    this.logger = world.getLogger();
    this.env = world.getEnvironment();
  }
  
  Compiler.prototype = {
    setFeatures: function(existingFeatures, modifiedFeatures, removedFeatures) {
      this.existing = existingFeatures;
      this.modified = modifiedFeatures;
      this.removed  = removedFeatures;
    },
    
    compile: function() {
      
      this.result = {success: true};
      
      this.logger.info("Compiling...");
      
      try {
        
        var componentStatus = this._compileComponentTypes();
        this._compileEvents();
        this._compileSystems();
        this._updateWorldLookups();
        
        this.logger.success("Compilation complete");
        
      } catch (e) {
        this.result.success = false;
        this.logger.error("Compilation aborted");
      } finally {
        return this.result;
      }
      
    },
    
    _compileComponentTypes: function() {
      
      this.logger.debug(" - compile component types");
      
      var manager = this.world.getComponentTypeManager();
      
      this.modified.component.forEach(function(c) { manager.add(c); });
      this.removed.component.forEach(function(c) { manager.remove(c.id); });
      
      return manager.compile();
      
    },
    
    _compileEvents: function() {
      
      this.logger.debug(" - compile events & categories");
      
      var manager = this.world.getEventManager();
      
      this.modified.category.forEach(function(c) { manager.addCategory(c); });
      this.removed.category.forEach(function(c) { manager.removeCategory(c); });
      
      this.modified.event.forEach(function(e) { manager.addEvent(e); });
      this.removed.event.forEach(function(e) { manager.removeEvent(e); });
      
      return manager.compile();
      
    },
    
    _compileSystems: function() {
      
      this.logger.debug(" - compile systems");
      
      var manager = this.world.getSystemManager();
      
      this.modified.system.forEach(function(s) { manager.add(s); });
      this.removed.system.forEach(function(s) { manager.remove(s); });
      
      return manager.compile();
      
    },
    
    _updateWorldLookups: function() {
      this.world.getEventManager().updateWorldLookups();
    }
    
  };
  
  fd.Compiler = Compiler;

})();