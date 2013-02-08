console.log('global');

var socket = io.connect();

socket.on('connect', function() {
  console.log('connected')


  // at the beginnin of match
  // all data to update users list and players
  socket.on('match', function(data) {
    /*
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
      hp: 0
    }
    */
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
      hp: 0
    }
    */
  });


  // when user leaves
  // need to delete user from lists
  socket.on('user.leave', function(id) {

  });


  // when player spawns
  // need to add that player to world
  socket.on('player.spawn', function(data) {
    /*
    data.user
    data.id
    data.x
    data.y
    data.hp
    */
  });


  // when player dies
  // need to change state of player
  socket.on('player.death', function(id) {

  });


  // identify which player is controlled by user
  socket.on('player.own', function(id) {

  });
});