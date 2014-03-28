system.title = 'Physics Renderer'
system.position = 100

system.update = function() {
  var ctx = this.env.ctx;

  for (var k in this.entities) {
    var entity = this.entities[k];
    var po = entity.position,
        ph = entity.physics;

    ctx.strokeStyle = ph.colliding
                      ? 'red'
                      : 'white';
    
    ctx.strokeRect(po.x, po.y,
                   ph.width, ph.height);
  }
}

system.acceptsEntity = function(entity) {
  return entity.position && entity.physics;
}
