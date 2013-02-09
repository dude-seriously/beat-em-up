exports.init = function(io) {

};

(function() {

  var World = this.World = new Class({
    initialize: function(width, height) {
      this.width = width;
      this.height = height;
    },
    data: function() {
      return {
        width: this.width,
        height: this.height
      }
    }
  });

})();