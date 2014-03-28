;(function() {
  
  function World(logger, env) {
    this.logger = logger;
    this.environment = env;
    this.registry = new fd.Registry(this);
    this.componentTypeManager = new fd.ComponentTypeManager(this);
    this.entityManager = new fd.EntityManager(this);
    this.eventManager = new fd.EventManager(this);
    this.systemManager = new fd.SystemManager(this);
    this.transport = new fd.Transport(this);
    
    this.eventQueue = [];
    this.destroyed = [];
    this.added = [];
    
    var lookup = {};
    
    // `world.lookup` is modified by the compiler to store quick lookups
    // to anything that changes between compilations. We use non-writable
    // properties to ensure these objects never change, hence making it
    // safe to capture references to them anywhere within the game.
    // DO NOT, however, cache the values of any keys found WITHIN these objects.
    // These values are completely, utterly, 100% volatile.
    
    Object.defineProperty(this, 'lookup', {
      value: lookup,
      enumerable: true,
      writable: false
    });
    
    Object.defineProperty(lookup, 'events', {
      value: {},
      enumerable: true,
      writable: false
    });
    
    Object.defineProperty(lookup, 'eventsAsync', {
      value: {},
      enumerable: true,
      writable: false
    });
    
    this._events = lookup.events;
    this._eventsAsync = lookup.eventsAsync;
    
  }
  
  World.prototype = {
    getLogger               : function() { return this.logger; },
    getEnvironment          : function() { return this.environment; },
    getRegistry             : function() { return this.registry; },
    getComponentTypeManager : function() { return this.componentTypeManager; },
    getEntityManager        : function() { return this.entityManager; },
    getEventManager         : function() { return this.eventManager; },
    getSystemManager        : function() { return this.systemManager; },
    getTransport            : function() { return this.transport; },
    
    reset: function() {
      this.eventQueue = [];
      
      var systems = this.systemManager.systems;
      for (var i = 0; i < systems.length; ++i) {
        sytems[i].reset();
      }
    },
    
    update: function(time) {
      
      var systems   = this.systemManager.systems,
          events    = this.eventQueue,
          destroyed = this.destroyed,
          added     = this.added;
      
      //
      // Handle lifecycle events
      
      for (var i = 0, l = destroyed.length; i < l; ++i) {
        
      }
      
      for (var i = 0, l = added.length; i < l; ++i) {
        
      }
      
      //
      // Dispatch async events
      
      for (var i = 0; i < events.length; ++i) {
        this.sendSync(events[i]);
      }
      
      events.splice(0, events.length);
      
      //
      // Tick systems
      
      for (var i = 0; i < systems.length; ++i) {
        var system = systems[i];
        if (system.enabled) {
          systems[i].update(time);
        }
      }
      
    },
    
    send: function(event) {
      if (this._eventsAsync[event.type]) {
        this.sendAsync(event);
      } else {
        this.sendSync(event);
      }
    },
    
    sendSync: function(event) {
      var type      = event.type,
          category  = type & this._events.CATEGORY_MASK;
      
      // TODO: optimise this (cache receivers on a per-category basis)
      this.systemManager.systems.forEach(function(s) {
        if (s.eventCategoryMask & category) {
          s.handleEvent(type, event);
        }
      });
    },
    
    sendAsync: function(event) {
      this.eventQueue.push(event);
    },
    
    sendLater: function(delay, event) {
      var events = this.eventQueue;
      setTimeout(function() { events.push(event); }, delay);
    },
    
    //
    // Lifecycle
    
    createEntity: function() {
      //return this._entityGenerator.createEntity();
    },
    
    addEntity: function(entityId) {
      //this._added.push(entityId);
    },
    
    destroyEntity: function(entityId) {
      //this._destroyed.push(entityId);
    },
    
    addComponent: function(entityId, component) {
      
    },
    
    removeComponent: function(entityId, component) {
      
    }
    
  }
  
  fd.World = World;
  
})();