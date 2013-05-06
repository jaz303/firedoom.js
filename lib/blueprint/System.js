;(function() {
  
  function System() {
    this.world = null;                // world that we're in
    this.env = null;                  // environment. populated automatically when world is set
    this.enabled = true;              // is this system running?
    this.eventCategories = [];        // list of friendly category names this sytem is interested in
    this.eventCategoryMask = null;    // auto-generated category mask
    this.requiredComponents = [];     // components and entity must possess in order to be added to this system
    this.componentMask = null;        // auto-generated component mask
  }
  
  System.prototype = {
    setWorld: function(world) {
      this.world = world;
      this.env = world.getEnvironment();
    },
    
    isEnabled: function() { return this.enabled; },
    
    setEnabled: function(enabled) {
      this.enabled = !!enabled;
    },
    
    enable: function() { this.setEnabled(true); },
    disable: function() { this.setEnabled(false); },
    toggleEnabled: function() { this.setEnabled(!this.enabled); },
    
    destroy: function() {
      this.teardown();
      this.env = null;
      this.world = null;
    },
    
    //
    // Event handling
    
    // send an event with event type's default synchronicity
    send: function(eventType, args) {
      args = args || {};
      args.type = eventType;
      args.source = this;
      this.world.send(args);
    },
    
    // send event synchronously. i.e. event will be delivered now,
    // on the callstack.
    sendSync: function(eventType, args) {
      args = args || {};
      args.type = eventType;
      args.source = this;
      this.world.sendSync(args);
    },
    
    // send event asynchronously. event will be delivered at the
    // beginning of the next frame.
    sendAsync: function(eventType, args) {
      args = args || {};
      args.type = eventType;
      args.source = this;
      this.world.sendAsync(args);
    },
    
    // send event asynchronously after a given delay.
    // event will be delivered at the beginning of the first
    // frame after `delay` milliseconds.
    sendLater: function(delay, eventType, args) {
      args = args || {};
      args.type = eventType;
      args.source = this;
      this.world.sendLater(delay, args);
    },
    
    //
    // Default implementations
    
    // called when system is installed into World
    // world/environment will be setup
    // perform any caching of required values here e.g. canvas context from env.
    prepare: function() { },
    
    // called when system is about to be destroyed forever
    // clear any timers and nullify any references which may cause memory leaks
    teardown: function() { },
    
    // called when world is reset.
    // system should remove all entities and reset its state to beginning of game
    reset: function() { },
    
    // returns a snapshot of current system state such that it can be later
    // restored. do not backup anything that you pluck from the environment
    // in `prepare`. do not backup entities, entity IDs only.
    snapshot: function() { },
    
    // restore a snapshot.
    // this method should throw an error if the snapshot is not compatible with
    // this version of the system.
    restore: function(snapshot) { },
    
    // run one 'tick' of the game
    update: function(time) { },
    
    // handle incoming message
    // message category mask has been checked to match this system's event mask
    // but event type needs to be checked.
    handleEvent: function(type, evt) { }
    
  };
  
  Object.defineProperty(System.prototype, 'featureType', {
    value       : fd.SYSTEM,
    enumerable  : true,
    writable    : false
  });
  
  fd.blueprint.System = System;
  
})();