;(function() {
  
  // ComponentTypeManager keeps track of known component types
  // and assigns bitmask/type IDs to each. An object is created
  // for each component type which is guaranteed to be
  // stable for as long as a given component type exists.
  
  function ComponentTypeManager(world) {
    
    this.world = world;
    
    this.assignedBits = 0;
    this.nextId = 1;
    this.recycledIds = [];
    
    // blueprint id is the friendly, user-assigned string ID 
    this.byBlueprintId = {};
    
    // component type id is the auto-assigned integer ID
    this.byComponentTypeId = [];
    
    // map of blueprint id => blueprint object
    this.added = {};
    
    // set of blueprint id
    this.removed = {};
  
  }
  
  ComponentTypeManager.prototype = {
    getTypeByBlueprintId: function(blueprintId) {
      return this.byBlueprintId[blueprintId];
    },
    
    getTypeByComponentId: function(componentId) {
      return this.byComponentTypeId[componentId];
    },
    
    add: function(blueprint) {
      this.added[blueprint.id] = blueprint;
    },
    
    remove: function(blueprintId) {
      if (typeof blueprintId != 'string')
        throw "blueprint ID to remove must be a string";
      this.removed[blueprintId] = true;
    },
    
    compile: function() {
      
      // TODO: this should return a summary of what has been
      // added, changed and removed. Because the next step for
      // the compiler is to destroy any removed components and
      // fix up any existing components to ensure they have
      // all of the expected fields.
      
      var changed = false;
      
      for (var k in this.removed) {
        
        var type = this.byBlueprintId[k];
        if (!type)
          throw "error - component type for blueprint ID '" + k + "' does not exist";
        
        delete this.byBlueprintId[k];
        this.byComponentTypeId[type.id] = undefined;
        
        this.recycledIds.push(type.id);
        this._unassignBit(type.bit);
        
        changed = true;
        
      }
      
      for (var k in this.added) {
        
        var existing = this.byBlueprintId[k];
        if (existing) {
          // nothing to do; this type already exists
          continue;
        }
        
        var blueprint = this.added[k];
        
        var type = {
          id          : this.recycledIds.pop() || this.nextId++,
          blueprintId : blueprint.id,
          title       : blueprint.id || blueprint.title,
          bit         : this._assignBit(),
          create      : function() { return blueprint.create(); }
        };
        
        blueprint.type = type;
        
        this.byBlueprintId[blueprint.id] = type;
        this.byComponentTypeId[type.id] = type;
        
        changed = true;
        
      }
      
      this.added = {};
      this.removed = {};
      
      return changed;
      
    },
    
    _assignBit: function() {
      for (var i = 0, bit = 1; i <= 31; ++i) {
        if ((bit & this.assignedBits) == 0) {
          this.assignedBits |= bit;
          return bit;
        }
        bit <<= 1;
      }
      throw "out of bits!";
    },
    
    _unassignBit: function(bit) {
      this.assignedBits &= ~bit;
    }
  };
  
  fd.ComponentTypeManager = ComponentTypeManager;
  
})();