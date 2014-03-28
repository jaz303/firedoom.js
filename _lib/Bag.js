;(function() {
  
  // Bag implementation
  // Ported from Artemis (com.artemis.utils.Bag)
  
  function Bag(capacity) {
    this.data = new Array(capacity || 16);
    this.length = 0;
  }
  
  Bag.prototype = {
    remove: function(ix) {
      var item = this.data[ix];
      this.data[ix] = this.data[--this.length];
      this.data[this.length] = null;
      return item;
    },
    
    removeLast: function() {
      var item = null;
      if (this.length > 0) {
        item = this.data[--this.length];
        this.data[this.length] = null;
      }
      return item;
    },
    
    removeObject: function(obj) {
      for (var i = 0; i < this.length; i++) {
        var tmp = this.data[i];
        if (tmp === obj) {
          this.data[i] = this.data[--this.length];
          this.data[this.length] = null;
          return true;
        }
      }
      return false;
    },
    
    contains: function(obj) {
      for (var i = 0; i < this.length; ++i) {
        if (obj === this.data[i])
          return true;
      }
      return false;
    },
    
    removeAll: function(other) {
      var modified = false;
      
      var otherLen = other.length;
      if (!Array.isArray(other)) {
        other = other.data; // assume bag
      }
      
      for (var i = 0; i < otherLen; ++i) {
        var o1 = other[i];
        for (var j = 0; j < this.length; ++j) {
          var o2 = this.data[j];
          if (o1 === o2) {
            this.remove(j);
            j--;
            modified = true;
            break;
          }
        }
      }
      
      return modified;
    },
    
    get: function(ix) {
      return this.data[ix];
    },
    
    isEmpty: function() {
      return this.length == 0;
    },
    
    add: function(obj) {
      this.data[this.length++] = obj;
    },
    
    set: function(ix, obj) {
      if (ix > this.length) {
        throw "now why would you want to do that?"
      } else if (ix == this.length) {
        this.data[this.length++] = obj;
      } else {
        this.data[ix] = obj;
      }
    },
    
    clear: function() {
      this.data.splice(0, this.length);
      this.length = 0;
    },
    
    addAll: function(collection) {
      var length = collection.length;
      if (!Array.isArray(collection)) {
        collection = collection.data; // assume bag
      }
      for (var i = 0; i < length; ++i) {
        this.data[this.length++] = collection[i];
      }
    }
  }
  
  fd.Bag = Bag;
  
})();