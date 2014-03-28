system.title = 'Health'
system.position = 3

system.prepare = function() {
  var self = this;
  // this.on('collision', function(evt) {
  //   if (evt.entity1.id in self.entities)
  //     self.world.removeEntity(evt.entity1);
  //   if (evt.entity2.id in self.entities)
  //     self.world.removeEntity(evt.entity2);
  // });
}

system.acceptsEntity = function(entity) {
  return entity.physics;
}