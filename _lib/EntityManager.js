;(function() {
  
  // Entity Manager
  // Ported from Artemis (com.artemis.EntityManager)
  
  function EntityManager(world) {
    this.world = world;
    this.activeEntities = [];
    this.recycledEntities = [];
    this.nextAvailableId = 1;
    this.length = 0;
    this.nextUniqueEntityId = 1;
    this.totalCreated = 0;
    this.totalRemoved = 0;
    this.componentsByType = [];
  }
  
  EntityManager.prototype = {
    create: function() {
      var entity = this.recycledEntities.pop();
      if (!entity) {
        entity = new fd.Entity(this, this.nextAvailableId++);
      } else {
        entity.reset();
      }
      entity.uniqId = this.nextUniqueEntityId++;
      this.activeEntities[entity.id] = entity;
      this.length++;
      this.totalCreated++;
      return entity;
    },
    
    remove: function(e) {
      this.activeEntities[e.id] = undefined;
      c.clearTypeBits();
      this.refresh(e);
      this.removeComponentsOfEntity(e);
      this.length--;
      this.totalRemoved++;
      this.recycledEntities.push(e);
    },
    
    removeComponentsOfEntity: function(e) {
      var eid = e.id;
      for (var i = 0; i < this.componentsByType.length; i++) {
        var components = this.componentsByType[i];
        if (components && components[eid]) {
          components[eid] = null;
        }
      }
    },
    
    isActive: function(entityId) {
      return !!this.activeEntities[entityId];
    },
    
    getEntity: function(entityId) {
      return this.activeEntities[entityId];
    },
    
    addComponent: function(entity, component) {
      var type  = component.type,
          cmps  = this.componentsByType;
          
      var cmpsOfType = cmps[type.id];
      if (!cmpsOfType) {
        cmpsOfType = cmps[type.id] = [];
      }
      
      cmpsOfType[entity.id] = component;
      entity.addTypeBit(type.bit);
    },
    
    refresh: function(entity) {
      // not sure what the point of this method is
    },
    
    removeComponent: function(entity, componentOrType) {
      var type = componentOrType.type || componentOrType;
      var components = this.componentsByType[type.id];
      if (components.length > entity.id) {
        components[entity.id] = undefined;
        entity.removeTypeBit(type.bit);
      } else {
        console.log("warning! entity ID " + entity.id + " has no component of type " + type);
      }
    },
    
    getComponent: function(entity, componentType) {
      var components = this.componentsByType[componentType.id];
      return (components && components[entity.id]) || null;
    },
    
    snapshot: function() {
      // snapshot of all entity/component state
    },
    
    restore: function(snapshot) {
      
    }
  };
  
  fd.EntityManager = EntityManager;
  
})();