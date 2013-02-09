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
      this.hp = 100;
      this.sp = 1;
      this.state = '';
      this.dead = false;
      this.input = null;
    },
    update: function(world) {
      if (this.input) {
        if (this.input.move) {
          if (this.input.move.x == 0 && this.input.move.y == 0) {
            this.vec[0] = 0;
            this.vec[1] = 0;
          } else {
            this.vec[0] = this.input.move.x;
            this.vec[1] = this.input.move.y;
            this.vec.norm();
            this.vec.scale(this.sp);
          }
        }
      }
      if (this.vec[0] != 0 || this.vec[1] != 0) {
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
      }
    },
    data: function(full) {
      if (full) {
        return {
          user: this.user.id,
          x: Math.floor(this.pos[0]),
          y: Math.floor(this.pos[1]),
          state: this.state,
          sp: this.sp,
          hp: this.hp
        }
      } else {
        return {
          x: Math.floor(this.pos[0]),
          y: Math.floor(this.pos[1]),
          state: this.state,
          sp: this.sp,
          hp: this.hp
        }
      }
    }
  });

  var PlayerList = this.PlayerList = new Class({
    initialize: function() {
      this.id = ++playerCount;
      this.count = 0;
      this.container = { };
    },
    add: function(player) {
      this.container[player.id] = player;
      ++this.count;

      var self = this;
      player.on('death', function() {
        self.remove(this);
      });
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
    }
  });
})();