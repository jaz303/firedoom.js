;(function() {
  
  function Vec2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };
  
  Vec2.zero = function() { return new Vec2(0,0); }
  Vec2.clone = function(v) { return new Vec2(v.x, v.y); }
  
  Vec2.prototype = {
    clone: function() { return new Vec2(this.x, this.y); }
  }
  
  fd.Vec2 = Vec2;
  
})();