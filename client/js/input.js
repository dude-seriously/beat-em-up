function Input() {
  events.add(this);

  // game actions
  this.v = {
    left:     false,
    right:    false,
    up:       false,
    down:     false,
    punch:    false,
    kick:     false,
    uppercut: false
  }

  // keyCode assigned to game action
  this.k = {
    37: 'left',
    39: 'right',
    38: 'up',
    40: 'down',
    90: 'punch', // z
    88: 'kick', // x
    67: 'uppercut' // c
  }

  var self = this;

  window.onkeydown = function(evt) {
    var key = self.k[evt.keyCode];
    if (key != undefined) {
      if (!self.v[key]) {
        self.v[key] = true;
        self.emit('change');
      }
    }
  };
  window.onkeyup = function(evt) {
    var key = self.k[evt.keyCode];
    if (key != undefined) {
      if (self.v[key]) {
        self.v[key] = false;
        self.emit('change');
      }
    }
  }

  // TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // major rework
  // touch input
  var buttons = document.querySelectorAll('[data-button]');
  var i = buttons.length;
  while(i--) {
    buttons[i].addEventListener('mousedown', function() {
      var key = this.getAttribute('data-button');
      if (self[key] != undefined && self[key] == false) {
        self[key] = true;
        self.emit('change');
      }
      return false;
    });
    buttons[i].addEventListener('mouseout', function() {
      var key = this.getAttribute('data-button');
      if (self[key] != undefined && self[key] == true) {
        self[key] = false;
        self.emit('change');
      }
      return false;
    });
  };
}
events.implement(Input);


Input.prototype.horiz = function() {
  return this.v.right - this.v.left;
}
Input.prototype.vert = function() {
  return this.v.down - this.v.up;
}


// TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// games should individually create own input handler

var input = new Input();


var arrows = {
  x: 0,
  y: 0
}
input.on('change', function() {
  var actions = { };
  if (this.horiz() != arrows.x || this.vert() != arrows.y) {
    arrows.x = this.horiz();
    arrows.y = this.vert();
    actions['move'] = arrows;
  }

  if (this.v.punch) {
    actions['kick'] = 1;
  }
  if (this.v.kick) {
    actions['kick'] = 2;
  }
  if (this.v.uppercut) {
    actions['kick'] = 3;
  }

  socket.emit('input', actions);
});