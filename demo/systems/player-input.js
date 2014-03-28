system.title = 'Player Input'
system.position = 1

system.reset = function() {
  System.prototype.reset.apply(this);
  this.player = null;
  this.dir = null;
  this.fired = false;
  this.lastShot = 0;
}

system.prepare = function() {
  var self = this;
  $(this.env.canvas).on('keydown.pi', function(evt) {
    if (evt.which == 37)
      self.dir = 'left';
    else if (evt.which == 39)
      self.dir = 'right';
    else if (evt.which == 32)
      self.fired = true;
  }).on('keyup.pi', function(evt) {
    if (evt.which == 37 || evt.which == 39)
      self.dir = null;
  });
}

system.teardown = function() {
  $(this.env.canvas).off('.pi');
}

system.update = function(clock) {
  if (!this.player)
    return;

  if (this.dir == 'left')
    this.player.physics.vx = -90;
  else if (this.dir == 'right')
    this.player.physics.vx = 90;
  else
    this.player.physics.vx = 0;

  if (this.fired) {
    var now = clock.time;
    if (now - this.lastShot > 250) {

      var missile = {
        physics: {
          vy: -150,
          vx: 0,
          width: MISSILE_WIDTH,
          height: MISSILE_HEIGHT,
          alignment: 'good'
        },
        position: {
          x: this.player.position.x + 22,
          y: this.player.position.y - 16
        },
        image: {
          image: imgMissileShip
        }
      };

      this.world.addEntity(missile);

      this.lastShot = now;
    }
  }

  this.fired = false;
}

system.entityAdded = function(entity) {
  if (entity.player)
    this.player = entity;
}

system.entityRemoved = function(entityId) {
  if (this.player && this.player.id === entityId)
    this.player = null;
}

system.createSnapshot = function() {
  return {
    player: this.player ? this.player.id : null,
    dir: this.dir,
    fired: this.fired,
    lastShot: this.lastShot
  }
}

system.installSnapshot = function(snapshot) {
  this.player = snapshot.player ? this.world.getEntity(snapshot.player) : null;
  this.dir = snapshot.dir;
  this.fired = snapshot.fired;
  this.lastShot = snapshot.lastShot;
}