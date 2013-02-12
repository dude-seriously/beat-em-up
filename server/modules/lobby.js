require(process.cwd() + '/modules/match')

exports.init = function(io) {
  io.sockets.on('connection', function(socket) {
    var user = getUser(socket);
    lobby.add(user);
  });
}

var matchSize = 2;

var Lobby = new Class({
  initialize: function() {
    this.users = new UserList();
  },
  add: function(user) {
    this.users.add(user);
    if (this.users.count == matchSize) {
      this.match();
    } else {
      this.users.pub('lobby', {
        users: this.users.count,
        match: matchSize
      });
    }
  },
  match: function() {
    var match = new Match();
    for(var id in this.users.all()) {
      match.userAdd(this.users.get(id));
    }
    this.users.clear();
    match.start();
  }
});

(function() {
  var lobby = this.lobby = new Lobby();
})();