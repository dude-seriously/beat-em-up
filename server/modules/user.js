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

    /*socket.on('setName', function(data) {
      var user = getUser(this);
      if (data.name && data.name.length >= 4 && data.name <= 12 && /^[a-z][a-z0-9_-]+$/i.test(data.name)) {
        user.setName(data.name);
      }
    });*/
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

      /*var self = this;
      this.socket.on('disconnect', function() {
        self.remove();
      });*/

      users[this.id] = this;
    },
    setName: function(name) {
      this.name = name;
/*
      var packet = {
        id: this.id,
        name: this.name
      }
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
        this.emit('remove');
        delete users[this.id];
        this.socket = null;
        this.lists = null;
      }
    },
    data: function() {
      return {
        id: this.id,
        name: this.name
      }
    }
  });

  var UserList = this.UserList = new Class({
    Implements: [process.EventEmitter],
    initialize: function() {
      this.id = ++userListCount;
      this.count = 0;
      this.container = { };
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
    data: function() {
      var data = { };
      for(var id in this.container) {
        data[id] = this.container[id].data();
      }
      return data;
    }
  });
})();

//(function() {
  /**/

//})();