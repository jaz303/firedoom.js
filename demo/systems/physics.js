system.title = 'Physics'
system.position = 0

system.update = function(clock) {
  var nvx = null;

  function isColliding(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1<=x2+w2)
            && (x1+w1>=x2)
            && (y1<=y2+h2)
            && (y1+h1>=y2);
  }

  for (var k in this.entities) {
    var entity = this.entities[k];
    var po = entity.position,
        ph = entity.physics;

    ph.colliding = false;

    po.x += ph.vx * (clock.delta / 1000);
    po.y += ph.vy * (clock.delta / 1000);

    if (po.y >= this.env.gameHeight || po.y < -ph.height)
      this.world.removeEntity(k);

    if (ph.alignment == 'evil') {
      if (ph.vx < 0 && po.x < this.env.gameBorder) {
        nvx = -ph.vx;
      } else if (ph.vx > 0 && (po.x + ph.width) > (this.env.gameWidth - this.env.gameBorder)) {
        nvx = -ph.vx;
      }
    }
  }

  for (var eid1 in this.entities) {
    var e1 = this.entities[eid1];
    for (var eid2 in this.entities) {

      // can't collide with self
      if (eid1 == eid2)
        continue;

      var e2 = this.entities[eid2];

      // no friendly fire
      if (e1.physics.alignment == e2.physics.alignment)
        continue;

      if (isColliding(e1.position.x,
                      e1.position.y,
                      e1.physics.width,
                      e1.physics.height,
                      e2.position.x,
                      e2.position.y,
                      e2.physics.width,
                      e2.physics.height)) {

        e1.physics.colliding = true;
        e2.physics.colliding = true;

        // TODO: trigger collision event
        this.world.emit('collision', {
          entity1: e1,
          entity2: e2
        });
      }
    }
  }

  if (nvx !== null) {
    for (var k in this.entities) {
      var entity = this.entities[k];
      if (entity.physics.alignment == 'evil') {
        entity.position.y += entity.physics.height;
        entity.physics.vx = nvx;
      }
    }
  }
}

system.acceptsEntity = function(entity) {
  return entity.position && entity.physics;
}