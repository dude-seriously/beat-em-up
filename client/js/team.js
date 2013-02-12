var teams = { };

function Team(data) {
  this.id    = data.id;
  this.name  = data.name;
  this.color = data.color;
  this.score = data.score ? data.score : 0;

  teams[this.id] = this;
  $(window).trigger('team:create', this);
}

Team.prototype.data = function(data) {
  if (data.score != undefined && data.score != this.score) {
    this.score = data.score;
    $(this).trigger('change:score');
  }
}

// Team.prototype.remove


// events / view

$(window).bind('team:create', function(evt, team) {
  $(team).bind('change:score', function() {
    $('.team[data-name="' + this.name + '"] > .score').html(this.score);
  })
});