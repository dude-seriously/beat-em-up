exports.init = function(io) {

};

(function() {
  var Item = this.Item = new Class({
    initialize: function(x, y) {
      this.x = x;
      this.y = y;
      this.player = null;
      this.lastPoint = 0;
      this.hit = null;
      this.damage = 0;
      this.dropped = 0;
    },
    grab: function(player) {
      if (!this.player) {
        if (new Date().getTime() - this.dropped > 1000) {
          this.player = player;
          this.player.item = true;
          this.lastPoint = 0;

          this.player.user.score += 3;
          this.player.user.team.score += 3;

          var self = this;

          this.player.once('death', function() {
            self.drop();
          });

          this.hit = function(damage) {
            self.damage += damage;
            if (self.damage >= 40) {
              self.drop();
            }
          }
          this.player.on('hit', this.hit);
        }
      }
    },
    drop: function() {
      if (this.player) {
        this.dropped = new Date().getTime();
        this.x = this.player.pos[0];
        this.y = this.player.pos[1];
        if (this.hit) {
          this.player.removeListener('hit', this.hit);
          this.hit = null;
        }
        this.player.item = false;
        this.damage = 0;
        this.player = null;
      }
    },
    update: function(time, players) {
      if (this.player) {
        if (time - this.lastPoint > 500) {
          this.lastPoint = time;
          this.player.user.score += 1;
          this.player.user.team.score += 1;
        }
      } else {
        for (var id in players.all()) {
          var player = players.get(id);
          if (player.kick) {
            if (Math.abs(player.pos[0] - this.x) < 32) {
              if (Math.abs(player.pos[1] - this.y) < 16) {
                this.grab(player);
              }
            }
          }
        }
      }
    },
    data: function() {
      if (this.player) {
        return {
          player: this.player.id
        }
      } else {
        return {
          x: this.x,
          y: this.y
        }
      }
    }
  });
})();