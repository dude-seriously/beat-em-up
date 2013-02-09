require(process.cwd() + '/modules/team');

exports.init = function(io) {

};

(function() {

  var World = this.World = new Class({
    initialize: function(width, height) {
      this.width = width;
      this.height = height;
      this.teams = new TeamList();
      this.time = 0;
    },
    data: function(full) {
      return {
        width: this.width,
        height: this.height,
        //teams: this.teams.data(full)
      }
    },
    update: function() {
      this.time = new Date().getTime();
    }
  });

})();