//var events = require('events');

exports.init = function(io) {

}

var playerCount = 0;

(function() {
  var Player = this.Player = new Class({
    Implements: [process.EventEmitter],
    initialize: function(data) {
      this.id = ++playerCount;
      this.user = data.user;
      this.x = data.x ? data.x : 0;
      this.y = data.y ? data.y : 0;
      this.nx = 0;
      this.ny = 0;
      this.hp = 100;
      this.state = '';
      this.dead = false;
    },
    update: function() {
      if (this.nx != 0 || this.ny != 0) {
        this.x += this.nx;
        this.y += this.ny;
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
        this.emit('death');
      }
    },
    data: function(full) {
      if (full) {
        return {
          user: this.user.id,
          x: this.x,
          y: this.y,
          state: this.state,
          hp: this.hp
        }
      } else {
        return {
          x: this.x,
          y: this.y,
          state: this.state,
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
    }
  });
})();