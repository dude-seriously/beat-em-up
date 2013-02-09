console.log('global');

var socket = io.connect();

var teams = { };
function Team(data) {
  this.id = data.id;
  this.color = data.color;
  this.score = data.score;
}

var users = { };
function User(data) {
  this.id = data.id;
  this.name = data.name;
  this.team = data.team;
  this.score = data.score;
  users[this.id] = this;
}

socket.on('connect', function() {
  console.log('connected')


  // when in lobby
  // get updates of players in lobby and how many needed for game
  socket.on('lobby', function(data) {
    /*
    data.users = 0;
    data.match = 0;
    */
    console.log('lobby');
    console.log(JSON.stringify(data));
  });


  // at the beginning of match
  // all data to update users list and players
  socket.on('match', function(data) {
    /*
    data.world = {
      width: 0,
      height: 0
    }
    // id based list
    teams: {
      name: '',
      color: '',
      points: 0
    }
    // id based list
    data.users = {
      name: ''
    }
    // id based list
    data.players = {
      user: '',
      id: 0,
      x: 0,
      y: 0,
      f: [1, -1],
      state: '',
      sp: 0,
      hp: 0
    }
    */

    for(var id in data.teams) {
      var team = new Team({
        id: id,
        color: data.teams[id].color,
        score: data.teams[id].score
      });
    }

    for(var id in data.users) {
      var user = new User({
        id: id,
        name: data.users[id].name,
        team: teams[data.users[id].team]
      });
    }

    for(var id in data.players) {
      var player = new Player({
        id: id,
        user: users[data.players[id].user],
        x: data.players[id].x,
        y: data.players[id].y,
        sp: data.players[id].sp,
        hp: data.players[id].hp,
        state: data.players[id].state,
        f: data.players[id].f
      });
    }

    /*for(var id in data.players) {
      $('body').append('<div class="player" id="player' + id + '" style="background:' + data.teams[data.users[data.players[id].user].team].color + '"><div class="health"><div></div></div><div class="face"></div><div class="kick"></div></div>');
    }*/

    console.log('match');
    console.log(JSON.stringify(data));

    /*socket.emit('input', {
      move: {
        x: 100,
        y: 0
      }
    })*/
  });


  // when match ends
  socket.on('match.end', function(data) {
    /*
      data.
    */
    console.log('match.end');
    console.log(JSON.stringify(data));
  });


  var lastHit = new Date().getTime();

  // on every ups as update
  // have list of players
  socket.on('state', function(data) {
    /*
    // id based list
    data.teams = {
      points: 0
    }
    data.players = {
      id: 0,
      x: 0,
      y: 0,
      state: '',
      sp: 0,
      hp: 0
    }
    */

    for(var id in data.players) {
      var player = data.players[id];
      $('#player' + id).css({
        left: Math.floor(player.x / 4) * 4,
        top: Math.floor(player.y / 4) * 4
      }).children('.face').css({
        left: player.f == 1 ? 42 : 0
      });

      $('#player' + id + ' > .health > div').css({
        width: player.hp + '%'
      });

      if (new Date().getTime() - lastHit > 400) {
        $('#player' + id + ' > .kick').css('display', 'none');
      }
      if (player.kick) {
        lastHit = new Date().getTime();
        switch(player.kick) {
          case 1:
            $('#player' + id + ' > .kick').css({
              display: 'block',
              top: 16,
              left: player.f == 1 ? 42 : 0
            })
            break;
          case 2:
            $('#player' + id + ' > .kick').css({
              display: 'block',
              top: 32,
              left: player.f == 1 ? 42 : 0
            })
            break;
          case 3:
            $('#player' + id + ' > .kick').css({
              display: 'block',
              top: 8,
              left: player.f == 1 ? 42 : 0
            })
            break;
        }
      }
    }

    // for(var id in data.players) {
    //   console.log(data.players[id].x + ', ' + data.players[id].y)
    // }
  });


  // when user leaves
  // need to delete user from lists
  socket.on('user.leave', function(id) {
    console.log('user.leave');
    console.log(id);
  });


  // when player spawns
  // need to add that player to world
  socket.on('player.spawn', function(data) {
    /*
    data.user = ''
    data.id = 0
    data.x = 0
    data.y = 0
    data.sp = 0
    data.hp = 0
    */
    $('body').append('<div class="player" id="player' + data.id + '" style="background:blue"><div class="health"><div></div></div><div class="face"></div><div class="kick"></div></div>');
    $('#player' + data.id).css({
      left: data.x,
      top: data.y,
    }).children('> .health');
    //console.log('player.spawn');
    //console.log(JSON.stringify(data));
  });


  // when player dies
  // need to change state of player
  socket.on('player.death', function(id) {
    //console.log('player.death');
    //console.log(id);
    $('#player' + id).remove();
  });


  // identify which player is controlled by user
  socket.on('player.own', function(id) {
    //console.log('player.own');
    //console.log(id);
  });
});