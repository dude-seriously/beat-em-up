exports.init = function(io) {

}

var colors = {
  red: 'red',
  green: 'green',
  neutral: 'gray'
}

var teamCount = 0;

(function() {
  var Team = this.Team = new Class({
    initialize: function(data) {
      this.id = ++teamCount;
      this.name = data.name;
      this.color = colors[this.name] ? colors[this.name] : 'gray';
      this.points = 0;
    },
    data: function(full) {
      if (full) {
        return {
          name: this.name,
          color: this.color,
          points: this.points
        }
      } else {
        return {
          points: this.points
        }
      }
    }
  });

  var TeamList = this.TeamList = new Class({
    initialize: function() {
      this.count = 0;
      this.container = { };
    },
    add: function(team) {
      this.container[team.id] = team;
      ++this.count;
    },
    get: function(id) {
      return this.container[id];
    },
    getByName: function(name) {
      for(var id in this.container) {
        if (this.container[id].name == name) {
          return this.container[id];
        }
      }
    },
    remove: function(team) {
      delete this.container[team.id];
      --this.count;
    },
    all: function() {
      return this.container;
    },
    data: function(full) {
      var teams = { };
      for(var id in this.container) {
        teams[id] = this.container[id].data(full);
      }
      return teams;
    },
    clear: function() {
      this.count = 0;
      this.container = { };
    }
  });
})();