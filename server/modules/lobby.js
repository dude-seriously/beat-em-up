require(process.cwd() + '/modules/match')

exports.init = function(io) {
  io.sockets.on('connection', function(socket) {
    var user = getUser(socket);
    lobby.add(user);
  });
}

var Lobby = new Class({
  initialize: function() {
    this.users = new UserList();
  },
  add: function(user) {
    this.users.add(user);
    if (this.users.count == 2) {
      this.match();
    }
  },
  match: function() {
    var match = new Match();
    for(var id in this.users.all()) {
      match.userAdd(this.users.get(id));
    }
    match.start();
    this.users.clear();
  }
});

(function() {
  var lobby = this.lobby = new Lobby();
})();