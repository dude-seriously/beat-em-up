var bodies = [ ];
var bodyLife = 5000; // 5 s

function Body(data) {
  this.x      = data.x;
  this.y      = data.y;
  this.f      = data.f;
  this.sprite = data.sprite;

  this.created = now;
  bodies.push(this);
}

Body.prototype.render = function() {
  if (now - this.created < bodyLife) {
    var draw = true;
    var fading = 0;
    if (now - this.created > (bodyLife - 1000)) { // start blinking on last second
      fading = Math.floor((now - this.created - (bodyLife - 1000)) / 100);
      draw = (fading % 2) == 1;
    }
    if (draw) {
      ctx.save();
      ctx.translate(this.x, this.y);
      if (this.f == -1) {
        ctx.scale(-1, 1);
      }
      if (fading) {
        fading = Math.floor(fading * 3.2);
        ctx.drawImage(this.sprite, 0, 0, 64, 32 - fading, -48, -32 + fading, 64, 32 - fading); // shift under ground
      } else {
        ctx.drawImage(this.sprite, -48, -32);
      }
      ctx.restore();
    }
  }
}

// cleanup every 0.5 s
setInterval(function() {
  var newBodies = [ ];

  var i = bodies.length;
  while(i--) {
    if (now - bodies[i].created < bodyLife) {
      newBodies.push(bodies[i]);
    }
  }

  bodies = newBodies;
}, 500);