require(process.cwd() + '/modules/user');
require(process.cwd() + '/modules/player');
require(process.cwd() + '/modules/world');

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
      this.world = null;
      this.players = null;
      this.timer = null;
    },
    start: function() {
      if (!this.timer) {
        this.world = new World(3000, 200);
        this.players = new PlayerList();
        for(var id in this.users.all()) {
          this.players.add(new Player({
            user: this.users.get(id)
          }));
        }
        this.users.pub('match', {
          world: this.world.data(),
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

        this.users.pub('match.end', {

        });

        this.users.clear();
        this.users = null;
        this.players.clear();
        this.players = null;
      }
    },
    // game loop
    update: function() {

      for(var id in this.users.all()) {
        var user = this.users.get(id);
        if (user.input) {
          for(var pId in this.players.all()) {
            var player = this.players.get(pId);
            if (player.user == user) {
              player.input = user.input;
            }
          }
        }
      }

      this.users.update();
      this.players.update(this.world);

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