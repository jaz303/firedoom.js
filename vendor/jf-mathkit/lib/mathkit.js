;(function() {
  
  function lerp(min, max, where) {
    return min + (max - min) * where;
  }
  
  lerp.create = function(min, max) {
    return function(where) { return lerp(min, max, where); };
  }
  
  function clamp(min, max, val) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }
  
  clamp.create = function(min, max) {
    return function(val) { return clamp(min, max, val); }
  }
  
  /**
   * Calculate the value at x of the gaussian function described by
   * parameters a, b, c.
   *
   * @param a peak value
   * @param b offset
   * @param c steepness
   */
  function gaussian(a, b, c, x) {
    var n = (x - b) * (x - b),
        d = 2 * c * c;
    return Math.pow(a * Math.E, -(n / d));
  }
  
  gaussian.create = function(a, b, c) {
    return function(x) { return gaussian(a, b, c, x); };
  }
  
  Math.lerp = lerp;
  Math.clamp = clamp;
  Math.gaussian = gaussian;
  
})();
