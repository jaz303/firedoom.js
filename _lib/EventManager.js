;(function() {
  
  function toConstCase(str) {
    return str.toUpperCase();
  }
  
  function EventManager(world) {
    
    this.world = world;
    
    this.categories = {};
    this.events = {};
    
    this._reset();
    
  }
  
  EventManager.prototype = {
    getCategoryByBlueprintId: function(blueprintId) { return this.categories[blueprintId]; },
    addCategory: function(blueprint) { this.categoriesModified[blueprint.id] = blueprint; },
    removeCategory: function(blueprintId) {
      if (typeof blueprintId != 'string')
        throw "blueprint ID to remove must be a string";
      this.categoriesRemoved[blueprintId] = true;
    },
    
    getEventByBlueprintId: function(blueprintId) { return this.events[blueprintId]; },
    addEvent: function(blueprint) { this.eventsModified[blueprint.id] = blueprint; },
    removeEvent: function(blueprintId) {
      if (typeof blueprintId != 'string')
        throw "blueprint ID to remove must be a string";
      this.eventsRemoved[blueprintId] = true;
    },
    
    compile: function() {
      this._compileCategories();
      this._compileEvents();
      this._reset();
    },
    
    updateWorldLookups: function() {
      
      var events      = this.world.lookup.events,
          eventsAsync = this.world.lookup.eventsAsync;
      
      for (var k in events)       delete events[k];
      for (var k in eventsAsync)  delete eventsAsync[k];
      
      for (var k in this.categories) {
        events['CAT_' + k.toUpperCase()] = this.categories[k].bit;
      }
      
      for (var k in this.events) {
        var evt = this.events[k];
        events[k.toUpperCase()] = evt.eventId;
        eventsAsync[evt.eventId] = evt.async;
      }
      
      events.CATEGORY_MASK = this.categoryMask;
      events.EVENT_MASK = ~this.categoryMask;
    
    },
    
    _compileCategories: function() {
      
      for (var k in this.categoriesModified) {
        var blueprint = this.categoriesModified[k];
        this.categories[k] = {
          id    : k,
          title : blueprint.title || k
        };
      }
      
      for (var k in this.categoriesRemoved) {
        delete this.categories[k];
      }
      
      var nextCategory  = 1 << 31,
          categoryMask  = 0,
          categoryCount = 0;
      
      for (var k in this.categories) {
        categoryMask |= nextCategory;
        this.categories[k].bit = nextCategory;
        nextCategory >>= 1;
        categoryCount++;
      }
      
      if (categoryCount > 0)
        nextCategory <<= 1;
        
      this.lastCategory = nextCategory;
      this.categoryMask = categoryMask;
      
    },
    
    _compileEvents: function() {
      
      for (var k in this.eventsModified) {
        var blueprint = this.eventsModified[k];
        this.events[k] = {
          id          : k,
          title       : blueprint.title || k,
          async       : !!blueprint.async,
          categories  : blueprint.categories || []
        };
      }
      
      for (var k in this.eventsRemoved) {
        delete this.events[k];
      }
      
      var nextEvent   = 1,
          categories  = this.categories;
          
      for (var k in this.events) {
        
        if (nextEvent == this.lastCategory)
          throw "event/category clash!";
        
        var event   = this.events[k],
            eventId = nextEvent++;
            
        event.categories.forEach(function(catId) {
          var cat = categories[catId];
          if (!cat) {
            this.world.getLogger().warning("(category ID '" + catId + "' does not exist)");
          } else {
            eventId |= cat.bit;
          }
        });
        
        event.eventId = eventId;
        
      }
      
    },
    
    _reset: function() {
      this.categoriesModified = {};
      this.categoriesRemoved = {};
      this.eventsModified = {};
      this.eventsRemoved = {};
    }
  };
  
  fd.EventManager = EventManager;
  
})();