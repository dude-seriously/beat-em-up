var userListCount = 0;
var users = { };

exports.init = function(io) {
  io.sockets.on('connection', function(socket) {
    new User(socket);

    socket.on('disconnect', function() {
      var user = getUser(socket);
      if (user != null) {
        user.remove();
      }
    });

    socket.on('input', function(data) {
      var user = getUser(socket);
      try {
        if (data.move && data.move.x != undefined && data.move.y != undefined) {
          user.addInput('move', {
            x: parseFloat(data.move.x),
            y: parseFloat(data.move.y)
          });
        }
        if (data.kick && typeof(data.kick) == 'number') {
          var kick = parseInt(data.kick);
          if (kick >= 1 && kick <= 3) {
            user.addInput('kick', kick);
          }
        }
      } catch(ex) { }
    });

    socket.on('setName', function(name) {
      var user = getUser(this);
      if (name && name.length >= 4 && name.length <= 10 && /^[a-z][a-z0-9_-]+$/i.test(name)) {
        user.setName(name);
      } else {
        console.log('invalid');
        console.log(name)
        console.log(/^[a-z][a-z0-9_-]+$/i.test(name))
      }
    });
  });
};

(function() {
  var getUser = this.getUser = function(socket) {
    return users[socket.id];
  }

  var User = this.User = new Class({
    Implements: [process.EventEmitter],
    initialize: function(socket) {
      this.id = socket.id;
      this.name = 'guest';
      this.socket = socket;
      this.lists = { };
      this.input = { };
      this.team = null;
      this.online = true;
      this.score = 0;

      /*var self = this;
      this.socket.on('disconnect', function() {
        self.remove();
      });*/

      users[this.id] = this;
    },
    addInput: function(name, data) {
      if (!this.input) {
        this.input = { };
      }
      this.input[name] = data;
    },
    update: function() {
      this.input = null;
    },
    setName: function(name) {
      this.name = name;

      /*var packet = {
        id: this.id,
        name: this.name
      }*/
      this.emit('name');
      /*console.log(this.lists)
      for(var id in this.lists) {
        this.lists[id].pub('setName', packet);
      }*/
    },
    listAdd: function(list) {
      this.lists[list.id] = list;
    },
    listRemove: function(list) {
      delete this.lists[list.id];
    },
    remove: function() {
      if (this.socket) {
        this.online = false;
        this.emit('remove');
        delete users[this.id];
        this.socket = null;
        this.lists = null;
      }
    },
    data: function(full) {
      if (full) {
        return {
          name: this.name,
          team: this.team.id
        }
      } else {
        return {
          score: this.score
        }
      }
    },
    send: function(name, data) {
      this.socket.emit(name, data);
    }
  });

  var UserList = this.UserList = new Class({
    Implements: [process.EventEmitter],
    initialize: function() {
      this.count = 0;
      this.container = { };
    },
    update: function() {
      for(var id in this.container) {
        this.container[id].update();
      }
    },
    add: function(user) {
      this.container[user.id] = user;
      user.listAdd(this);
      ++this.count;

      var self = this;
      user.on('remove', function() {
        if (self.container[this.id]) {
          delete self.container[this.id];
          --self.count;
          self.emit('remove', this);
        }
      });
    },
    get: function(id) {
      return this.container[id];
    },
    remove: function(user) {
      if (this.container[user.id]) {
        delete this.container[user.id];
        user.listRemove(this);
        --this.count;
        this.emit('remove', user);
      }
    },
    clear: function() {
      this.count = 0;
      for(var id in this.container) {
        this.container[id].listRemove(this);
      }
      this.container = { };
    },
    all: function() {
      return this.container;
    },
    pub: function(name, data) {
      for(var id in this.container) {
        var user = this.container[id];
        user.socket.emit(name, data);
      }
    },
    data: function(full) {
      var data = { };
      for(var id in this.container) {
        data[id] = this.container[id].data(full);
      }
      return data;
    }
  });
})();

//(function() {
  /**/

//})();