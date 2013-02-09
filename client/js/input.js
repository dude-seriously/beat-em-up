function Input() {
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;

  var self = this;

  window.onkeydown = function(evt) {
    //console.log(evt.keyCode)
    switch(evt.keyCode) {
      case 37:
        self.left = true;
        $(self).trigger('change');
        break;
      case 39:
        self.right = true;
        $(self).trigger('change');
        break;
      case 40:
        self.down = true;
        $(self).trigger('change');
        break;
      case 38:
        self.up = true;
        $(self).trigger('change');
        break;
    }
  }
  window.onkeyup = function(evt) {
    switch(evt.keyCode) {
      case 37:
        self.left = false;
        $(self).trigger('change');
        break;
      case 39:
        self.right = false;
        $(self).trigger('change');
        break;
      case 40:
        self.down = false;
        $(self).trigger('change');
        break;
      case 38:
        self.up = false;
        $(self).trigger('change');
        break;
    }
  }
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
  if (this.horiz() != arrows.x || this.vert() != arrows.y) {
    arrows.x = this.horiz();
    arrows.y = this.vert();

    socket.emit('input', {
      move: arrows
    });
  }
});