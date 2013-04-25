;(function() {
  
  var EVENTS = fd.events,
      EVENTS_ASYNC = fd.eventAsync;
  
  function World() {
    this._systems = [];
    this._eventQueue = [];
  }
  
  World.prototype = {
    setSystems: function(newSystems) {
      this._systems = newSystems;
    },
    
    reset: function() {
      this._eventQueue = [];
      for (var i = 0; i < systems.length; ++i) {
        sytems[i].reset();
      }
    },
    
    update: function(time) {
      
      //
      // Handle lifecycle events
      
      // TODO: implement
      
      //
      // Dispatch async events
      
      var events = this._eventQueue;
      for (var i = 0; i < events.length; ++i) {
        this.sendSync(events[i]);
      }
      
      events.splice(0, events.length);
      
      //
      // Tick systems
      
      var systems = this._systems;
      for (var i = 0; i < systems.length; ++i) {
        var system = systems[i];
        if (system.enabled) {
          systems[i].update(time);
        }
      }
      
    },
    
    send: function(event) {
      if (EVENTS_ASYNC[event.type]) {
        this.sendAsync(event);
      } else {
        this.sendSync(event);
      }
    },
    
    sendSync: function(event) {
      var type      = event.type,
          category  = type & EVENTS.CATEGORY_MASK;
      
      // TODO: optimise this (cache receivers on a per-category basis)
      this._systems.forEach(function(s) {
        if (s.eventCategoryMask & category) {
          s.handleEvent(type, event);
        }
      });
    },
    
    sendAsync: function(event) {
      this._eventQueue.push(event);
    },
    
    sendLater: function(delay, event) {
      var events = this._eventQueue;
      setTimeout(function() { events.push(event); }, delay);
    },
    
    _sendSyncSlow: function(event) {
      
    },
    
    _sendSyncFast: function(event) {
      
    }
    
  }
  
  fd.World = World;
  
})();