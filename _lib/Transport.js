;(function() {
  
  var TARGET_FPS = 40;
  
  var Transport = Base.extend(function(world) {
    
    this.world = world;
    this.running = false;
    
    this.runStateChanged = new Signal(this, 'runStateChanged');
  
  }, {
    methods: {
      isRunning: function() { return this.running; },

      start: function() {
        if (this.running)
          return;

        var self  = this,
            world = this.world;

        function tick() {
          if (!self.running) return;
          world.update();
          setTimeout(tick, 1000 / TARGET_FPS);
        }

        this.running = true;
        this.runStateChanged.emit();

        tick();
      },

      stop: function() {
        if (this.running) {
          this.running = false;
          this.runStateChanged.emit();
        }
      }
    }
  });
  
  fd.Transport = Transport;
  
})();