(function() {
  // degree to radians coefficient
  var rd = this.rd = Math.PI / 180.0;

  // vector [x, y] library
  var Vec2 = this.Vec2 = {
    // internal cache
    cache: [ ],
    // clear internal cache
    clear: function() {
      this.cache = [ ];
    },
    // create new vector with given x, y
    new: function(x, y) {
      if (this.cache.length > 0) {
        var vec = this.cache.pop();
        vec[0] = x;
        vec[1] = y;
        return vec;
      } else {
        return new Float32Array([x, y]);
      }
    }
  };


  // delete vector
  Float32Array.prototype.delete = function() {
    Vec2.cache.push(this);
  }

  // clone vector
  Float32Array.prototype.clone = function() {
    return Vec2.new(this[0], this[1]);
  }

  // adds to vectors
  Float32Array.prototype.add = function(v) {
    this[0] += v[0];
    this[1] += v[1];
  }

  // subtracts two vectors
  Float32Array.prototype.sub = function(v) {
    this[0] -= v[0];
    this[1] -= v[1];
  }

  // scales vector
  Float32Array.prototype.scale = function(s) {
    this[0] *= s;
    this[1] *= s;
  }

  // returns length of vector
  Float32Array.prototype.len = function() {
    return Math.sqrt((this[0] * this[0]) + (this[1] * this[1]));
  }

  // returns dot product of two vectors
  Float32Array.prototype.dot = function(v) {
    return this[0] * v[0] + this[1] * v[1];
  }

  // normalize vector
  Float32Array.prototype.norm = function() {
    var l = 1.0 / Math.sqrt((this[0] * this[0]) + (this[1] * this[1]));
    this[0] *= l;
    this[1] *= l;
  }

  // returns degrees of vector
  Float32Array.prototype.deg = function() {
    return Math.atan2(this[0], this[1]) / rd;
  }

  // rotates vector by certain degrees
  Float32Array.prototype.rot = function(d) {
    d       = d * rd;
    var x   = this[0] * Math.cos(d) - this[1] * Math.sin(d);
    this[1] = this[1] * Math.cos(d) + this[0] * Math.sin(d);
    this[0] = x;
  }
})();