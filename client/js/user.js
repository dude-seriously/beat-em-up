var users = { };

function User(data) {
  events.add(this);

  this.id    = data.id;
  this.name  = data.name;
  this.team  = data.team;
  this.score = data.score ? data.score : 0;

  users[this.id] = this;

  events.emit('user:create', this);
}
events.implement(User);

User.prototype.data = function(data) {
  if (data.score != undefined && data.score != this.score) {
    this.score = data.score;
    this.emit('change:score');
  }
  if (data.name != undefined) {
    this.name = data.name;
    this.emit('change:name');
  }
}

User.prototype.remove = function() {
  delete users[this.id];
  this.emit('remove');
}


// events / view

events.on('user:create', function(user) {
  $('.team[data-name="' + user.team.name + '"] > .users').append('<div class="user" data-id="' + user.id + '"><span class="name">' + user.name + '</span><span class="score">0</span></div>');

  user.on('change:score', function() {
    $('.user[data-id="' + this.id + '"] > .score').html(this.score);
  });

  user.on('change:name', function() {
    $('.user[data-id="' + this.id + '"] > .name').html(this.name);
  });

  user.on('remove', function() {
    $('.user[data-id="' + this.id + '"]').remove();
  });
});