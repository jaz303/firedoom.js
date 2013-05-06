;(function() {
  
  function SystemManager(world) {
    this.world = world;
    this.systems = [];
    this._reset();
  }
  
  SystemManager.prototype = {
    getSystemByBlueprintId: function(blueprintId) {
      var systems = this.systems.length;
      for (var i = 0, l = systems.length; i < l; ++i) {
        var system = systems[i];
        if (system.id === blueprintId) {
          return system;
        }
      }
      return null;
    },
    
    add: function(blueprint) {
      this.modified[blueprint.id] = blueprint;
    },
    
    remove: function(blueprintId) {
      if (typeof blueprintId != 'string')
        throw "blueprint ID to remove must be a string";
      this.removed[blueprintId] = true;
    },
    
    compile: function() {
      
      var added         = [],
          modified      = [],
          removed       = [],
          restoreFailed = [];
      
      var systems       = this.systems,
          logger        = this.world.getLogger();
      
      // First, scan all existing systems and see if there are any updates
      for (var i = 0, l = systems.length; i < l; ++i) {
        var existingSystem = systems[i],
            modifiedSystem = this.modified[existingSystem.id];
        
        if (modifiedSystem) {
          
          modifiedSystem.setWorld(this.world);
          modifiedSystem.setEnabled(existingSystem.isEnabled());
          modifiedSystem.prepare();
          
          try {
            modifiedSystem.restore(existingSystem.snapshot());
            // TODO: there should be probably be a post-restore phase?
          } catch (e) {
            // modified system could not restore snapshot.
            // just reset the system and notify the compiler that
            // the restore failed. then the user can decide what to
            // do e.g. re-seed system from all known entities.
            modifiedSystem.reset();
            restoreFailed.push(modifiedSystem);
          }
          
          existingSystem.destroy();
          systems[i] = modifiedSystem;
          
          modified.push(modifiedSystem);
          delete this.modified[existingSystem.id];
          
        }
      }
      
      // Any systems remaining in `modified` must be new
      for (var k in this.modified) {
        var system = this.modified[k];
        system.setWorld(this.world);
        system.prepare();
        system.reset();
        systems.push(system);
        added.push(system);
      }
      
      // Next, zap all removed systems
      for (var k in this.removed) {
        var system = null;
        for (var i = 0; i < systems.length; ++i) {
          var system = sytems[i];
          if (system.id === k) {
            system.destroy();
            removed.push(system);
            systems.splice(i, 1);
            --i;
          }
        }
      }
      
      // Finally, update all of the event category and component masks
      
      var componentManager  = this.world.getComponentTypeManager()
          eventManager      = this.world.getEventManager();
          
      systems.forEach(function(system) {
        
        system.eventCategoryMask = 0;
        system.eventCategories.forEach(function(eventCategoryId) {
          var category = eventManager.getCategoryByBlueprintId(eventCategoryId);
          if (category) {
            system.eventCategoryMask |= category.bit;
          } else {
            logger.warning("System '" + system.id + "' refers to non-existent event category '" + eventCategoryId + "' (ignored)");
          }
        });
        
        system.componentMask = 0;
        system.requiredComponents.forEach(function(componentId) {
          var componentType = componentManager.getTypeByBlueprintId(componentId);
          if (componentType) {
            system.componentMask |= componentType.bit;
          } else {
            logger.warning("System '" + system.id + "' refers to non-existent component '" + componentId + "' (ignored)");
          }
        });
        
      });
      
      this._reset();
      
      logger.debug([
        "   ",
        added.length,
        " added, ",
        modified.length,
        " modifed, ",
        removed.length,
        " removed, ",
        restoreFailed.length,
        " restore failed"
      ].join(''));
      
      return {
        success       : true,
        added         : added,
        modified      : modified,
        removed       : removed,
        restoreFailed : restoreFailed
      };
      
    },
    
    _reset: function() {
      this.modified = {};
      this.removed = {};
    }
  };
  
  fd.SystemManager = SystemManager;
  
})();
