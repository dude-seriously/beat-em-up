exports.init = function(express, app, io, path) {
  app.configure(function() {
    app.use(express.static(path));
  });
}