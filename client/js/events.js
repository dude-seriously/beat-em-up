var Events = function() {
  this.events = { };
}

Events.prototype.on = function(name, fn) {
  var events = this.events[name];
  if (!events) {
    events = this.events[name] = [ fn ];
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
    }
  }
  return this;
};

Events.prototype.once = function(name, fn) {
  var events = this.events[name];
  fn.once = true;
  if (!events) {
    events = this.events[name] = [ fn ];
  } else {
    if (events.indexOf(fn) == -1) {
      events.push(fn);
    }
  }
  return this;
};

Events.prototype.emit = function(name, args) {
  var events = this.events[name];
  if (events) {
    var i = events.length;
    while(i--) {
      if (events[i]) {
        events[i].apply(this, [ args ]);
        if (events[i].once) {
          delete events[i];
        }
      }
    }
  }
  return this;
};

Events.prototype.unbind = function(name, fn) {
  if (name) {
    var events = this.events[name];
    if (events) {
      if (fn) {
        var i = events.indexOf(fn);
        if (i != -1) {
          delete events[i];
        }
      } else {
        delete this.events[name];
      }
    }
  } else {
    delete this.events;
    this.events = { };
  }
  return this;
}


// global events
var events = new Events();
events.add = function(obj) {
  obj.events = { };
}
events.implement = function(fn) {
  fn.prototype = Object.create(Events.prototype);
}