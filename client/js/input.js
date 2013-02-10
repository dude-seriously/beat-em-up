function Input() {
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
  this.z = false;
  this.x = false;
  this.c = false;

  var self = this;

  window.onkeydown = function(evt) {
   //console.log(evt.keyCode)
    switch(evt.keyCode) {
      case 37:
        if (!self.left) {
          self.left = true;
          $(self).trigger('change');
        }
        break;
      case 39:
        if (!self.right) {
          self.right = true;
          $(self).trigger('change');
        }
        break;
      case 40:
        if (!self.down) {
          self.down = true;
          $(self).trigger('change');
        }
        break;
      case 38:
        if (!self.up) {
          self.up = true;
          $(self).trigger('change');
        }
        break;
      case 90:
        if (!self.z) {
          self.z = true;
          $(self).trigger('change');
        }
        break;
      case 88:
        if (!self.x) {
          self.x = true;
          $(self).trigger('change');
        }
        break;
      case 67:
        if (!self.c) {
          self.c = true;
          $(self).trigger('change');
        }
        break;
    }
  }
  window.onkeyup = function(evt) {
    switch(evt.keyCode) {
      case 37:
        if (self.left) {
          self.left = false;
          $(self).trigger('change');
        }
        break;
      case 39:
        if (self.right) {
          self.right = false;
          $(self).trigger('change');
        }
        break;
      case 40:
        if (self.down) {
          self.down = false;
          $(self).trigger('change');
        }
        break;
      case 38:
        if (self.up) {
          self.up = false;
          $(self).trigger('change');
        }
        break;
      case 90:
        if (self.z) {
          self.z = false;
          $(self).trigger('change');
        }
        break;
      case 88:
        if (self.x) {
          self.x = false;
          $(self).trigger('change');
        }
        break;
      case 67:
        if (self.c) {
          self.c = false;
          $(self).trigger('change');
        }
        break;
    }
  }

  $('[data-button]').mousedown(function(evt) {
    var key = $(this).attr('data-button');
    if (self[key] != undefined) {
      self[key] = true;
      $(self).trigger('change');
    }
    evt.preventDefault();
    return false;
  });
  $('[data-button]').mouseout(function() {
    var key = $(this).attr('data-button');
    if (self[key] != undefined) {
      self[key] = false;
      $(self).trigger('change');
    }
  });
}


Input.prototype.horiz = function() {
  return this.right - this.left;
}
Input.prototype.vert = function() {
  return this.down - this.up;
}

var input = new Input();
input.horiz();
input.vert();



var arrows = {
  x: 0,
  y: 0
}
$(input).bind('change', function() {
  var input = { };
  var changed = false;
  if (this.horiz() != arrows.x || this.vert() != arrows.y) {
    arrows.x = this.horiz();
    arrows.y = this.vert();
    input['move'] = arrows;
    changed = true;
  }
  if (this.z) {
    input['kick'] = 1;
    changed = true;
  }
  if (this.x) {
    input['kick'] = 2;
    changed = true;
  }
  if (this.c) {
    input['kick'] = 3;
    changed = true;
  }
  if (changed) {
    socket.emit('input', input);
  }
});