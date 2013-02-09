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
        var self = this;

        this.world = new World(3000, 200);
        this.world.teams.add(new Team({
          name: 'red',
          x: 100,
          y: 100
        }));
        this.world.teams.add(new Team({
          name: 'green',
          x: 400,
          y: 100
        }));

        this.players = new PlayerList();
        var odd = true;
        for(var id in this.users.all()) {
          var user = this.users.get(id);

          odd = !odd;
          if (odd) {
            user.team = this.world.teams.getByName('red');
          } else {
            user.team = this.world.teams.getByName('green');
          }

          var player = new Player({
            user: user,
            x: user.team.x,
            y: user.team.y
          });
          player.on('death', function() {
            return self.playerDeath(this);
          });
          this.players.add(player);
        }
        this.users.pub('match', {
          world: this.world.data(true),
          teams: this.world.teams.data(true),
          users: this.users.data(true),
          players: this.players.data(true)
        });
        for(var id in this.users.all()) {
          var user = this.users.get(id);
          for(var pId in this.players.all()) {
            var player = this.players.get(pId);
            if (player.user == user) {
              user.send('player.own', player.id);
            }
          }
        }
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
      this.world.update();
      this.players.update(this.world);
      this.users.update();

      var state = {
        teams: this.world.teams.data(),
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
    },
    playerDeath: function(player) {
      var self = this;

      this.players.remove(player);
      this.users.pub('player.death', player.id);

      if (player.user.online) {
        var player = new Player({
          user: player.user,
          x: player.user.team.x,
          y: player.user.team.y
        });
        player.on('death', function() {
          return self.playerDeath(this);
        });
        this.players.add(player);

        this.users.pub('player.spawn', player.data(true));
        player.user.send('player.own', player.id);
      }
    }
  });

})();