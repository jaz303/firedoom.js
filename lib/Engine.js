;(function() {
  
  function Engine(logger, env) {
    this.logger = logger;
    this.world = new fd.World(logger, env);
    this.initialLoad = [];
    this.initialised = new Signal(this, 'initialised');
  }
  
  Engine.prototype = {
    getWorld: function() { return this.world; },
    
    init: function(callback) {
      var self = this;
      
      this._loadAll(function(success) {
        self.initialised.emit({success: success});
        if (success) {
          self.world.getRegistry().compile();
        }
      });
    },
    
    load: function(type, id, src) {
      this.initialLoad.push({type: type, id: id, src: src});
    },
    
    _loadAll: function(callback) {
      var remaining = this.initialLoad.length,
          called    = false,
          self      = this;
          
      this.logger.debug(remaining + " features to load");
      
      for (var i = 0; i < remaining; ++i) {
        var spec = this.initialLoad[i];
        this._loadOne(spec.type, spec.id, spec.src, function(success) {
          if (success) {
            if (--remaining == 0) {
              callback(true);
            }
          } else {
            if (!called) {
              called = true;
              callback(false)
            }
          }
        });
      }
    },
    
    _loadOne: function(type, id, src, callback) {
      var registry  = this.world.getRegistry(),
          featureId = type + "." + id;
      
      var logger = this.logger;
      logger.debug("Loading " + featureId + " from " + src);
      
      $.ajax(src + '?r=' + Math.random(), {
        dataType: 'text',
        error: function() {
          logger.error("Error loading " + featureId + " from " + src);
          callback(false);
        },
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