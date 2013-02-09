require(process.cwd() + '/modules/math');

exports.init = function(io) {

}

var playerCount = 0;

(function() {
  var Player = this.Player = new Class({
    Implements: [process.EventEmitter],
    initialize: function(data) {
      this.id = ++playerCount;
      this.user = data.user;
      this.pos = Vec2.new(data.x ? data.x : 0, data.y ? data.y : 0);
      this.vec = Vec2.new(0, 0);
      this.f = 1;
      this.hp = 100;
      this.sp = 1;
      this.state = '';
      this.dead = false;
      this.kick = 0;
      this.hitDelay = 0;
      this.lastHit = 0;
      //this.input = null;
    },
    update: function(world) {
      try {
        if (!this.dead) {
          if (this.user.input) {
            // apply moving input
            if (this.user.input.move) {
              if (this.user.input.move.x == 0 && this.user.input.move.y == 0) {
                this.vec[0] = 0;
                this.vec[1] = 0;
              } else {
                this.vec[0] = this.user.input.move.x;
                this.vec[1] = this.user.input.move.y;
                this.vec.norm();
                this.vec.scale(this.sp);
              }
            }
          }
          // moving
          if (this.vec[0] != 0 || this.vec[1] != 0) {
            if (this.vec[0] != 0) {
              if (this.vec[0] > 0) {
                this.f = 1;
              } else {
                this.f = -1;
              }
            }
            this.pos[0] += this.vec[0];
            this.pos[1] += this.vec[1] * .5;

            if (this.pos[0] < 0) {
              this.pos[0] = 0;
            } else if (this.pos[0] > world.width) {
              this.pos[0] = world.width;
            }
            if (this.pos[1] < 0) {
              this.pos[1] = 0;
            } else if (this.pos[1] > world.height) {
              this.pos[1] = world.height;
            }
          }
          // hit
          this.kick = 0;

          if (this.user.input) {
            if (this.user.input.kick) {
              if (world.time - this.lastHit > this.hitDelay) {
                this.kick = this.user.input.kick;
                this.lastHit = world.time;
                this.hitDelay = 500 * this.kick;
              }
            }
          }
        }
      } catch(ex) {
        console.log(ex);
      }
    },
    hit: function(damage) {
      this.hp -= damage;

      if (this.hp <= 0) {
        this.kill();
      }
    },
    kill: function() {
      if (!this.dead) {
        this.dead = true;
        this.hp = 0;
        this.pos.delete();
        this.vec.delete();
        this.emit('death');
        this.user = null;
      }
    },
    data: function(full) {
      var data = {
        id: this.id,
        x: Math.floor(this.pos[0]),
        y: Math.floor(this.pos[1]),
        f: this.f,
        state: this.state,
        sp: this.sp,
        hp: this.hp
      }
      if (full) {
        data.user = this.user.id;
      } else {
        if (this.kick != 0) {
          data.kick = this.kick;
        }
      }
      return data;
    }
  });

  var PlayerList = this.PlayerList = new Class({
    initialize: function() {
      this.count = 0;
      this.container = { };
    },
    add: function(player) {
      this.container[player.id] = player;
      ++this.count;
    },
    get: function(id) {
      return this.container[id];
    },
    remove: function(player) {
      delete this.container[player.id];
      --this.count;
    },
    all: function() {
      return this.container;
    },
    data: function(full) {
      var players = { };
      for(var id in this.container) {
        players[id] = this.container[id].data(full);
      }
      return players;
    },
    clear: function() {
      this.count = 0;
      this.container = { };
    },
    update: function(world) {
      for(var id in this.container) {
        this.container[id].update(world);
      }
      for(var id in this.container) {
        var player = this.container[id];
        if (player.kick > 0) {
          for(var pId in this.container) {
            if (id != pId) {
              var victim  = this.container[pId];
              if (Math.abs(victim.pos[1] - player.pos[1]) < 20) {
                if (player.f == 1) {
                  if (victim.pos[0] - player.pos[0] > -16 && victim.pos[0] - player.pos[0] < 56) {
                    victim.hit(50);
                  }
                } else {
                  if (player.pos[0] - victim.pos[0] > -16 && player.pos[0] - victim.pos[0] < 56) {
                    victim.hit(50);
                  }
                }
              }
            }
          }
        }
      }
    }
  });
})();