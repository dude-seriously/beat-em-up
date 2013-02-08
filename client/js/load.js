var scripts = [
  {
    name: 'jquery',
    file: '/js/jquery.js'
  }, {
    name: 'global',
    file: '/js/global.js',
    requires: [
      'jquery'
    ]
  }, {
    name: 'socket.io',
    file: '/socket.io/socket.io.js'
  }
];


function ScriptLoader(data) {
  this.scripts = data.scripts;
  this.total = this.scripts.length;
  this.loaded = 0;
  this.step = data.step.bind(this);
  this.complete = data.complete;
  this.error = data.error;
  this.load();
}
ScriptLoader.prototype.load = function() {
  if (this.total == this.loaded) {
    if (this.complete != undefined) {
      this.complete();
    }
  } else {
    var i = this.total;
    while(i--) {
      if (!this.scripts[i].loaded) {
        var delay = false;
        var d = this.total;
        while(d--) {
          if (this.scripts[d].loaded != 1 && this.scripts[i].requires && this.scripts[i].requires.indexOf(this.scripts[d].name) != -1) {
            delay = true;
          }
        }
        if (!delay) {
          this.loadScript(this.scripts[i]);
        }
      }
    }
  }
}
ScriptLoader.prototype.loadScript = function(script) {
  if (script.loaded != false) {
    var self = this;
    script.loaded = false;
    var element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = script.file + '?' + new Date().getTime();
    element.onload = element.onreadystatechange = function() {
      if (script.loaded == false && (!this.readyState || this.readyState == 'complete')) {
        script.loaded = true;
        self.loaded++;
        if (self.step != undefined) {
          self.step(script);
        }
        self.load();
      }
    };
    element.onerror = function() {
      if (self.error != undefined) {
        self.error(script);
      }
    }
    document.body.appendChild(element);
  }
}


new ScriptLoader({
  scripts: scripts,
  step: function() {
    var progress = Math.floor((this.loaded / this.total) * 100);
    console.log('loading: ' + progress + '%');
  },
  error: function() {
    console.error('error loading scripts');
  },
  complete: function() {
    console.log('scripts loaded');
  }
});