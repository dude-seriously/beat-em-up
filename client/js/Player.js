;(function (BeatEmUp, Bb) {

	BeatEmUp.PlayerModel = Bb.Model.extend({
		defaults: {
			id: 0,
			x: 0,
			y: 0
		},

		initialize: function() {
			this.on("error", function (model, error) {
				BeatEmUp.debug("Error in PlayerModel (id " + model.id + '): ' + error, "PlayerModel");
			});
		},

		validate: function (attr, options) {
			if (attr.id < 0 || typeof attr.id != "number") {
				return "Invalid ID (" + attr.id + ")";
			}

			if (attr.x < 0 || attr.y < 0) {
				return "Invalid coordinates (x: " + attr.x + ", y: " + attr.y);
			}

			if (typeof attr.x != "number" || typeof attr.y != "number") {
				return "Coordinates not a number (type of x: " + (typeof attr.x) + ", type of y: " + (typeof attr.y);
			}
		},

		getCoordinates: function() {
			return {
				x: this.get("x"),
				y: this.get("y")
			}
		}
	});
})(window.BeatEmUp = window.BeatEmUp || {}, Backbone);