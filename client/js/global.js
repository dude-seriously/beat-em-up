var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
ctx.font = '14px "pixel"';

var socket = io.connect();

var teams = { };
function Team(data) {
  this.id = data.id;
  this.name = data.name;
  this.color = data.color;
  this.score = data.score;
  teams[this.id] = this;
}
Team.prototype.data = function(data) {
  if (data.score != this.score) {
    this.score = data.score;
    $('.team[data-name="' + this.name + '"] > .score').html(this.score);
  }
}

var users = { };
function User(data) {
  this.id = data.id;
  this.name = data.name;
  this.team = data.team;
  this.score = data.score ? data.score : 0;
  users[this.id] = this;

  $('.team[data-name="' + this.team.name + '"] > .users').append('<div class="user" data-id="' + this.id + '"><span class="name">' + this.name + '</span><span class="score">0</span></div>');
}
User.prototype.data = function(data) {
  if (data.score != undefined) {
    if (data.score != this.score) {
      this.score = data.score;
      $('.user[data-id="' + this.id + '"] > .score').html(this.score);
    }
  }
  if (data.name != undefined) {
    if (data.name) {
      this.name = data.name;
      $('.user[data-id="' + this.id + '"] > .name').html(this.name);
    }
  }
}


var item = null;
function Item(x, y) {
  this.x = x;
  this.y = y;
  this.player = 0;
}

var chicken_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.chicken, 0, 0, 42, 32, 0, 200, 3, 0, 0);
chicken_sprite.StartAnimation();
Item.prototype.renderBottom = function() {
  if (this.player == 0) {
    ctx.save();

    //this.context.globalAlpha = 0.3;
    ctx.translate(this.x, this.y - 2);
    ctx.scale(1, .5);
    ctx.beginPath();
    ctx.arc(0, 0, 29, 0 , 2 * Math.PI, false);
    ctx.strokeStyle = '#f60';
    ctx.lineWidth = 4;
    ctx.stroke();
   // this.context.globalAlpha = 1;

    ctx.restore();
  }
}
Item.prototype.render = function() {
  if (this.player == 0) {
    ctx.save();
    // ctx.translate(-16, -24);

    // ctx.beginPath();

    // ctx.fillStyle = '#f00';
    // ctx.rect(this.x, this.y, 32, 24);
    // ctx.fill();

    // ctx.restore();
    chicken_sprite.SetLocation(this.x, this.y);
    chicken_sprite.Draw(ctx);
    //console.log('place')
  }
}



$('.changeNameButton').click(function() {
  var name = $('.changeName > input').val();
  if (name.length >= 4 && name.length <= 10 && /^[a-z][a-z0-9_-]+$/i.test(name)) {
    socket.emit('setName', name);
    $('.changeName > input').blur();
  } else {
    console.log('inavlid');
  }
});
$('.changeName > input').keyup(function(evt) {
  if (evt.keyCode == 13) {
    $('.changeNameButton').click();
  }
});


var own = 0;

var touch = 'ontouchstart' in document.documentElement;
if (window.navigator.userAgent.toLowerCase().indexOf('touch') != -1 ||
    window.navigator.userAgent.toLowerCase().indexOf('tablet pc 2.0') != -1 ||
    touch) {

  $('.touch').css('display', 'block');
}

socket.on('connect', function() {
  // when in lobby
  // get updates of players in lobby and how many needed for game
  socket.on('lobby', function(data) {
    $('#lobby > .users').html(data.users + ' / ' + data.match);
  });

  var PlayerModels = {};
  var PlayerViews = {};

  var GameLoop = function () {
    for (var id in PlayerModels) {
      PlayerModels[id].walkToDestination();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(32, 152);

    var renderables = [];
    for(var id in PlayerViews) {
      renderables.push(PlayerViews[id]);
    }
    if(item.player == 0) {
      renderables.push(item);
    }

    renderables.sort(function(a, b) {
      var aY = 0;
      if (a.model) {
        aY = a.model.get('y');
      } else {
        aY = a.y;
      }
      var bY = 0;
      if (b.model) {
        bY = b.model.get('y');
      } else {
        bY = b.y;
      }
      return bY - aY;
    });

    var i = renderables.length;
    while(i--) {
      if (renderables[i].renderBottom) {
        renderables[i].renderBottom();
      }
    }

    i = renderables.length;
    while(i--) {
      renderables[i].render(true);
    }

    i = renderables.length;
    while(i--) {
      if (renderables[i].renderTop) {
        renderables[i].renderTop();
      }
    }
  }

  // at the beginning of match
  // all data to update users list and players
  socket.on('match', function(data) {
    $('#lobby').remove();
    $('#gameplay').css('display', 'block');

    for(var id in data.teams) {
      var team = new Team({
        id: id,
        name: data.teams[id].name,
        color: data.teams[id].color,
        score: data.teams[id].score
      });
    }

    for(var id in data.users) {
      var user = new User({
        id: id,
        name: data.users[id].name,
        team: teams[data.users[id].team],
        score: data.users[id].score
      });
    }

    item = new Item(data.item.x, data.item.y);

    BeatEmUp.enableDebug(true);
    for(var id in data.players) {

      if (users[data.players[id].user].team.name == "green") {
        var my_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dudeWalk, data.players[id].x, data.players[id].y, 58, 74, 0, 100, 3, 0, 0);
        var my_fight_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dudePunch, data.players[id].x, data.players[id].y, 58, 74, 0, 100, 3, 0, 1)
        var my_hold_sprite =  new BeatEmUp.Sprite(BeatEmUp.Images.dudeHold, data.players[id].x, data.players[id].y, 58, 74, 0, 100, 3, 0, 0);
      } else {
        var my_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dude2Walk, data.players[id].x, data.players[id].y, 58, 74, 0, 100, 3, 0, 0);
        var my_fight_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dude2Punch, data.players[id].x, data.players[id].y, 58, 74, 0, 100, 3, 0, 1);
         new BeatEmUp.Sprite(BeatEmUp.Images.dude2Hold, data.players[id].x, data.players[id].y, 58, 74, 0, 100, 3, 0, 0);
      }

      PlayerModels[id]  = new BeatEmUp.PlayerModel({
        id: id,
        user: users[data.players[id].user],
        x: data.players[id].x,
        y: data.players[id].y,
        speed: data.players[id].sp,
        hp: data.players[id].hp,
        state: data.players[id].state,
        facing: data.players[id].f
      });

      PlayerViews[id] = new BeatEmUp.PlayerView({
        model: PlayerModels[id],
        sprite: my_sprite,
        fight_sprite: my_fight_sprite,
        context: ctx
      });

    }

    setInterval(GameLoop, 1000/60);
  });


  // when match ends
  socket.on('match.end', function(data) {
    console.log('match.end');
    console.log(JSON.stringify(data));
  });


  var lastHit = new Date().getTime();

  /*

     STATE


     on every ups as update
     have list of players
     */
  socket.on('state', function(data) {
    if (data.item.player) {
      item.player = data.item.player;
    } else {
      item.x = data.item.x;
      item.y = data.item.y;
      item.player = 0;
    }

    for(var id in data.teams) {
      teams[id].data(data.teams[id]);
    }

    for(var id in data.users) {
      users[id].data(data.users[id]);
    }

    for(var id in data.players) {
      var model = PlayerModels[id];
      var p = data.players[id];

      model.set({
        destination_x: p.x,
        destination_y: p.y,
        speed: p.sp,
        facing: p.f,
        hp: p.hp,
        state: p.state
      });

      if (~~(data.players[id].kick) > 0) {
        PlayerViews[id].startHitting();
      }

      model.set({walking: (p.state == "walk")});
    }
  });


  // when user leaves
  // need to delete user from lists
  socket.on('user.leave', function(id) {
    console.log(id)
    $('.user[data-id="' + id + '"]').remove();
  });


  socket.on('setName', function(data) {
    var user = users[data.id];
    user.data({
      name: data.name
    })
  });


  // when player spawns
  // need to add that player to world
  socket.on('player.spawn', function(data) {
    if (users[data.user].team.name == "green") {
      var my_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dudeWalk, data.x, data.y, 58, 74, 0, 100, 3, 0, 0);
      var my_fight_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dudePunch, data.x, data.y, 58, 74, 0, 100, 3, 0, 1)
    } else {
      var my_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dude2Walk, data.x, data.y, 58, 74, 0, 100, 3, 0, 0);
      var my_fight_sprite = new BeatEmUp.Sprite(BeatEmUp.Images.dude2Punch, data.x, data.y, 58, 74, 0, 100, 3, 0, 1)
    }

    PlayerModels[data.id] = new BeatEmUp.PlayerModel({
      id: data.id,
      user: users[data.user],
      x: data.x,
      y: data.y,
      speed: data.sp,
      hp: data.hp,
      state: data.state,
      facing: data.f
    });

    PlayerViews[data.id] = new BeatEmUp.PlayerView({
      model: PlayerModels[data.id],
      sprite: my_sprite,
      fight_sprite: my_fight_sprite,
      context: ctx
    });
  });


  // when player dies
  // need to change state of player
  socket.on('player.death', function(id) {
    delete PlayerModels[id];
    delete PlayerViews[id];
  });


  // identify which player is controlled by user
  socket.on('player.own', function(id) {
    own = id;
  });
});