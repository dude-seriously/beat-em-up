;(function (BeatEmUp, Bb) {

	/*

		Model

	*/

	BeatEmUp.PlayerModel = Bb.Model.extend({
		defaults: {
			id: 0,
			x: 0,
			y: 0,
			destination_x: 0,
			destination_y: 0,
			speed: 1,
			walking: false
		},

		initialize: function(attributes) {
			this.on("error", function (model, error) {
				BeatEmUp.debug("Error in PlayerModel (id " + model.id + '): ' + error, "PlayerModel");
			});
			this.set({"destination_x": attributes.x});
			this.set({"destination_y": attributes.y});
		},

		validate: function (attr, options) {
			if (attr.id < 0) {
				return "Invalid ID (" + attr.id + ", type" + (typeof attr.id) + ")";
			}

			if (attr.x < 0 || attr.y < 0) {
				return "Invalid coordinates (x: " + attr.x + ", y: " + attr.y + ')';
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
		},

		setDestination: function (x, y) {
			this.set({destination_x: x, destination_y: y});
		},

		walkToDestination: function() {

			var x = this.get("x");
			var dx = this.get("destination_x");

			var y = this.get("y");
			var dy = this.get("destination_y");

			var s = this.get("speed");

			// if (x != dx || y != dy) {
			// 	this.set({walking: true});
			// } else {
			// 	this.set({walking: false});
			// }

			this.set({'x': dx, 'y': dy});


			// if (x != dx || y != dy) {

			// 	if (x != dx) {
			// 		if (Math.abs(x-dx)<s) {
			// 			this.set({'x': dx});
			// 		} else if (x < dx) {
			// 			this.set({'x': x + s});
			// 		} else {
			// 			this.set({'x': x - s});
			// 		}
			// 	}

			// 	if (y != dy) {
			// 		if (Math.abs(y-dy)<s) {
			// 			this.set({'y': dy});
			// 		} else if (y < dy) {
			// 			this.set({'y': y + s});
			// 		} else {
			// 			this.set({'y': y - s});
			// 		}
			// 	}
			// 	this.set({walking: true});
			// } else {
			// 	this.set({walking: false});
			// }
		}
	});



	/*

		View

	*/


	BeatEmUp.PlayerView = Bb.View.extend({
		initialize: function(attributes) {
			if (typeof attributes.model == "object") {
				this.model.on("change", this.handleChange, this);
				this.model.on("change:walking", this.handleWalkState, this);
				this.model.on("change:facing", this.handleFacing, this)
			} else {
				BeatEmUp.debug("Init Error: Did not assign model to PlayerView", "PlayerView");
				return false;
			}

			this.sprite = attributes.sprite;
			this.fight_sprite = attributes.fight_sprite;
			this.hold_sprite = attributes.hold_sprite;
			this.context = attributes.context;
			this.fighting = false;

		},

		handleChange: function () {
			var x = this.model.get("x");
			var y = this.model.get("y");

			this.sprite.SetLocation(x, y);
			this.fight_sprite.SetLocation(x, y);

			this.render();
		},

		handleWalkState: function () {
			if (this.model.get("walking")) {
				clearTimeout(this.timeout);
				this.sprite.StartAnimation();
			} else {
				this.sprite.StopAnimation().ResetAnimation();
			}
		},

		handleFacing: function () {
			if (this.model.get("facing") == 1) {
				this.sprite.row = 0;
				this.fight_sprite.row = 0;
			} else {
				this.sprite.row = 1;
				this.fight_sprite.row = 1;
			}
		},

		startHitting: function () {
			if (this.fighting == false) {
				var self = this;
				this.fighting = true;
				this.fight_sprite.StartAnimation(function () {
					self.fight_sprite.StopAnimation();
					self.fight_sprite.ResetAnimation();
					self.fighting = false;
				});
			}
		},

		render: function (render) {
	      if (render) {
	        this.context.save();

	        //this.context.translate(-29, -74);

	        if (this.fighting == true) {
	        	this.fight_sprite.Draw(this.context);
	        } else {
	        	this.sprite.Draw(this.context);
	        }

	        this.context.restore();
	      }
		},
    renderTop: function() {
		var x = Math.floor(this.model.get('x') / 4) * 4;
		var y = Math.floor(this.model.get('y') / 2) * 2;

		this.context.save();

		this.context.beginPath();
		this.context.fillStyle = '#000';
		this.context.rect(x - 29, y + 4, 59, 4);
		this.context.fill();

		var hp = this.model.get('hp');
		this.context.beginPath();
		this.context.fillStyle = hp > 50 ? '#0f0' : (hp > 25 ? '#ff0' : '#f00');
		var bars = Math.floor(hp / 10);
		var i = bars;
		while(i--) {
		this.context.rect(x + (i * 6) - 29, y + 4, 5, 4)
		}
		this.context.fill();

		this.context.textAlign = 'center';
		this.context.fillStyle = this.model.get('user').team.name == 'green' ? '#26f' : '#ff0';
		this.context.fillText(this.model.get('user').name, x, y - 70);

		this.context.restore();
    },
    renderBottom: function() {
      var x = Math.floor(this.model.get('x') / 4) * 4;
      var y = Math.floor(this.model.get('y') / 2) * 2;
      if (this.model.id == own) {
        this.context.save();

        //this.context.globalAlpha = 0.3;
        this.context.translate(x, y - 2);
        this.context.scale(1, .5);
        this.context.beginPath();
        this.context.arc(0, 0, 29, 0 , 2 * Math.PI, false);
        this.context.strokeStyle = this.model.get('user').team.name == 'green' ? '#26f' : '#ff0';
        this.context.lineWidth = 4;
        this.context.stroke();
       // this.context.globalAlpha = 1;

        this.context.restore();
      }
    }
	});


})(window.BeatEmUp = window.BeatEmUp || {}, Backbone);