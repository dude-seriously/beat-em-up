require(process.cwd() + '/modules/user');
require(process.cwd() + '/modules/player');

exports.init = function(io) {

}

var ups = 10;
var tick = 1000 / ups;

(function() {

  var Match = this.Match = new Class({
    initialize: function() {
      var self = this;
      this.users = new UserList();
      this.users.on('remove', function(user) {
        if (this.count == 0) {
          self.stop();
        } else {
          self.removePlayers(user);
        }
      });
      //this.world = new World();
      this.players = null;
      this.timer = null;
    },
    start: function() {
      if (!this.timer) {
        this.players = new PlayerList();
        for(var id in this.users.all()) {
          this.players.add(new Player({
            user: this.users.get(id)
          }));
        }
        this.users.pub('match', {
          users: this.users.data(),
          players: this.players.data(true)
        })
        this.timer = setInterval(this.update.bind(this), ups);
      }
    },
    stop: function() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // game loop
    update: function() {

      var state = {
        players: this.players.data()
      }

      this.users.pub('state', state);
    },
    userAdd: function(data) {
      if (this.timer == null) {
        this.users.add(data);
        /*data.on('remove', function() {
          self.userRemove(this);
        });*/
      }
    },
    removePlayers: function(user) {
      for(var id in this.players.all()) {
        var player = this.players.get(id);
        if (player.user.id == user.id) {
          player.kill();
        }
      }
    }
  });

})();