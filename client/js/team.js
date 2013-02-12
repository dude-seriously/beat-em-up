var teams = { };

function Team(data) {
  events.add(this);

  this.id    = data.id;
  this.name  = data.name;
  this.color = data.color;
  this.score = data.score ? data.score : 0;

  teams[this.id] = this;

  events.emit('team:create', this);
}
events.implement(Team);

Team.prototype.data = function(data) {
  if (data.score != undefined && data.score != this.score) {
    this.score = data.score;
    this.emit('change:score');
  }
}

Team.prototype.remove = function() {
  delete teams[this.id];
  this.emit('remove');
}


// TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// teams should be created on each match but not globally


// events / view

events.on('team:create', function(team) {
  team.on('change:score', function() {
    $('.team[data-name="' + this.name + '"] > .score').html(this.score);
  })
});