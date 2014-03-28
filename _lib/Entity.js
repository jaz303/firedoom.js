;(function() {
  
  // TODO: tags
  // TODO: groups
  
  function Entity(world, id) {
    this.world = world;
    this.entityManager = world.getEntityManager();
    this.id = id;
    this.typeBits = 0;
    this.systemBits = 0;
    this.uniqId = null;
  };
  
  Entity.prototype = {
    reset: function() {
      this.typeBits = 0;
      this.systemBits = 0;
    },
    
    addTypeBit: function(bit) { this.typeBits |= bit; },
    removeTypeBit: function(bit) { this.typeBits &= ~bit; },
    clearTypeBits: function() { this.typeBits = 0; },
    
    addComponent: function(cmp) {
      this.entityManager.addComponent(this, cmp);
    },
    
    removeComponent: function(cmp) {
      this.entityManager.removeComponent(this, cmp);
    },
    
    removeComponentById: function(cmpId) {
      this.entityManager.removeComponentById(this, cmpId);
    },
    
    getComponent: function(cmpId) {
      return this.entityManager.getComponent(this, cmpId);
    },
    
    getComponents: function() {
      return this.entityManager.getComponents(this);
    },
    
    isActive: function() {
      return this.entityManager.isActive(this.id);
    },
    
    refresh: function() {
      this.world.refreshEntity(this);
    },
    
    destroy: function() {
      this.world.destroyEntity(this);
    },
    
    toString: function() {
      return "<Entity id=" + this.id + " uniqId=" + this.uniqId + " components=" + this.typeBits + ">";
    }
  }
  
  fd.Entity = Entity;
  
})();