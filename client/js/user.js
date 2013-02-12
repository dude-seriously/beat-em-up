var users = { };

function User(data) {
  this.id    = data.id;
  this.name  = data.name;
  this.team  = data.team;
  this.score = data.score ? data.score : 0;

  users[this.id] = this;
  $(window).trigger('user:create', this);
}

User.prototype.data = function(data) {
  if (data.score != undefined && data.score != this.score) {
    this.score = data.score;
    $(this).trigger('change:score');
  }
  if (data.name != undefined) {
    this.name = data.name;
    $(this).trigger('change:name');
  }
}

User.prototype.remove = function() {
  delete users[this.id];
  $(this).trigger('remove');
}


// events / view

$(window).bind('user:create', function(evt, user) {
  $('.team[data-name="' + user.team.name + '"] > .users').append('<div class="user" data-id="' + user.id + '"><span class="name">' + user.name + '</span><span class="score">0</span></div>');

  $(user).bind('change:score', function() {
    $('.user[data-id="' + this.id + '"] > .score').html(this.score);
  });

  $(user).bind('change:name', function() {
    $('.user[data-id="' + this.id + '"] > .name').html(this.name);
  });

  $(user).bind('remove', function() {
    $('.user[data-id="' + this.id + '"]').remove();
  });
});