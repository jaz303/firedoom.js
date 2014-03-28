system.title = 'Enemy AI'
system.position = 2

system.reset = function() {
  System.prototype.reset.apply(this);
  this.lastShot = 0;
}

system.update = function(clock) {
  var now           = clock.time,
      sinceLastShot = now - this.lastShot;

  // fire max once every 0.5s
  if (sinceLastShot < 500)
    return;

  // probability of firing increases as time
  // since last shot approaches 10s
  var pfire = 1 - (10000 - sinceLastShot) / 10000;
  pfire *= pfire;

  if (this.world.random() > pfire)
    return;

  var eids = Object.keys(this.entities);
  
  if (eids.length == 0)
    return;
  
  var shooterId = eids[Math.floor(this.world.random() * eids.length)],
      shooter   = this.entities[shooterId];
      
  var missile = {
    physics: {
      vy: 150,
      vx: 0,
      width: MISSILE_WIDTH,
      height: MISSILE_HEIGHT,
      alignment: 'evil'
    },
    position: {
      x: shooter.position.x + 14,
      y: shooter.position.y + 30
    },
    image: {
      image: imgMissileInvader
    }
  };

  this.world.addEntity(missile);

  this.lastShot = now;
}

system.acceptsEntity = function(entity) {
  return entity.physics
          && entity.physics.alignment == 'evil'
          && entity.position;
}

system.createSnapshot = function() {
  return {
    lastShot: this.lastShot
  }
}

system.installSnapshot = function(snapshot) {
  this.lastShot = snapshot.lastShot;
}