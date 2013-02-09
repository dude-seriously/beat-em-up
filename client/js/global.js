console.log('global');

var socket = io.connect();

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
    data.users = {
      id: '',
      name: ''
    }
    // id based list
    data.players = {
      user: '',
      id: 0,
      x: 0,
      y: 0,
      state: '',
      sp: 0,
      hp: 0
    }
    */

    for(var id in data.players) {
      $('body').append('<div class="player" id="player' + id + '"></div>');
    }

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


  // on every ups as update
  // have list of players
  socket.on('state', function(data) {
    /*
    // id based list
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
      $('#player' + id).css({
        left: Math.floor(data.players[id].x / 4) * 4,
        top: Math.floor(data.players[id].y / 4) * 4
      });
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
    console.log('player.spawn');
    console.log(JSON.stringify(data));
  });


  // when player dies
  // need to change state of player
  socket.on('player.death', function(id) {
    console.log('player.death');
    console.log(id);
  });


  // identify which player is controlled by user
  socket.on('player.own', function(id) {
    console.log('player.own');
    console.log(id);
  });
});