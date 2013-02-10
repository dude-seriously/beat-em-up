require(process.cwd() + '/modules/user');
require(process.cwd() + '/modules/player');
require(process.cwd() + '/modules/world');
require(process.cwd() + '/modules/item');

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
      this.item = null;
      this.timer = null;
    },
    start: function() {
      if (!this.timer) {
        var self = this;

        this.world = new World(768, 200);
        this.world.teams.add(new Team({
          name: 'red',
          x: 668,
          y: 100
        }));
        this.world.teams.add(new Team({
          name: 'green',
          x: 100,
          y: 100
        }));

        this.item = new Item(Math.floor(this.world.width / 2), Math.floor(this.world.height / 2));

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
            y: user.team.y,
            f: user.team.name == 'red' ? 1 : -1
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
          players: this.players.data(true),
          item: this.item.data()
        });
        for(var id in this.users.all()) {
          var user = this.users.get(id);
          user.on('name', function() {
            self.users.pub('setName', {
              id: this.id,
              name: this.name
            })
          });
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
      this.item.update(this.world.time, this.players);
      this.users.update();

      var state = {
        teams: this.world.teams.data(),
        users: this.users.data(),
        players: this.players.data(),
        item: this.item.data()
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
          y: Math.floor(Math.random() * (this.world.height - 64)) + 32,
          f: player.user.team.name == 'red' ? 1 : -1
        });
        player.on('death', function() {
          return self.playerDeath(this);
        });
        this.players.add(player);

        this.users.pub('player.spawn', player.data(true));
        player.user.send('player.own', player.id);
      } else {
        this.users.pub('user.leave', player.user.id);
      }
    }
  });

})();