;(function() {
  
  function Engine() {
    this.env = null;
    this.world = new fd.World;
    
    this.registry = new fd.Registry;
    this.registry.setWorld(this.world);
    
    this._initialLoad = [];
    this._running = false;
  }
  
  Engine.prototype = {
    setEnvironment: function(env) {
      this.env = env;
      this.registry.setEnvironment(env);
    },
    
    init: function(callback) {
      var self = this;
      
      this._loadAll(function(success) {
        if (success) {
          self.registry.compile();
        }
        callback(success);
      });
    },
    
    load: function(type, id, src) {
      this._initialLoad.push({type: type, id: id, src: src});
    },
    
    start: function() {
      if (this._running)
        return;
      
      var self  = this,
          world = this.world;
      
      function tick() {
        if (!self._running) return;
        world.update();
        setTimeout(tick, 1000 / 25);
      }
      
      this._running = true;
      tick();
    },
    
    stop: function() {
      this._running = false;
    },
    
    _loadAll: function(callback) {
      var remaining = this._initialLoad.length,
          called = false;
      
      for (var i = 0; i < remaining; ++i) {
        var spec = this._initialLoad[i];
        this._loadOne(spec.type, spec.id, spec.src, function(success) {
          if (success) {
            if (--remaining == 0) {
              callback(true);
            }
          } else {
            if (!called) {
              called = true;
              callback(false);
            }
          }
        });
      }
    },
    
    _loadOne: function(type, id, src, callback) {
      var registry = this.registry;
      
      $.ajax(src + '?r=' + Math.random(), {
        dataType: 'text',
        error: function() { callback(false); },
        success: function(code) {
          var thing = registry.create(type, id, code);
          if (thing) {
            registry.add(thing);
            callback(true);
          } else{
            callback(false);
          }
        }
      });
    }
  }
  
  fd.Engine = Engine;

})();