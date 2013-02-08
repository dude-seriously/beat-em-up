;(function (BeatEmUp, $, undefined) {

	BeatEmUp.Sprite = function (spritesheet, dx, dy, dw, dh, row, interval, frames, pingpong, loops, callback) {
		this.spritesheet = spritesheet;
		this.x = dx;	// Destination x
		this.y = dy;	// Destination y
		this.ox = dx;
		this.oy = dy;
		this.dw = dw;	// Width of the frame
		this.dh = dh;	// Height of the frame
		this.row = row;	// Row in spritesheet
		this.interval = interval; // Interval between frames
		this.total_frames = frames;
		this.pingpong = pingpong;
		this.loops = loops; // number of loops (0 = infinite)
		this.callback = callback;

		this.current_frame = 0;
		this.current_loop = 0;
		this.animating = false;
		this.pingpong_direction = 1; // 1 = incrementing frame count, 0 = decrementing frame count
		this.timeout = false;
	}


	BeatEmUp.Sprite.prototype.SetLocation = function (x, y) {
		this.x = x;
		this.y = y;

		return this;
	}

	BeatEmUp.Sprite.prototype.Draw = function (context, x, y) {
		if (this.spritesheet.complete) {
			context.drawImage(this.spritesheet, this.current_frame*this.dw, this.row*this.dh, this.dw, this.dh, this.x - cameraX + this.ox, this.y - cameraY + this.oy, this.dw, this.dh);
		}

		return this;
	}

	BeatEmUp.Sprite.prototype.IsAnimating = function () {
		return this.animating;
	}

	BeatEmUp.Sprite.prototype.StartAnimation = function () {
		if (!this.animating) {
	        this.animating = true;
	        this.Animate();
		}

		return this;
	}

	BeatEmUp.Sprite.prototype.StopAnimation = function () {
		this.animating = false;
		clearTimeout(this.timeout);

		return this;
	}

	BeatEmUp.Sprite.prototype.Animate = function () {
		if (this.animating == true) {
			if (this.pingpong) {
			    if (this.pingpong_direction == 1) {
			        this.current_frame++;
			        if (this.current_frame == this.total_frames) {
			            this.current_frame -= 2;
			            this.pingpong_direction = 0;
			        }
			    } else {
			        this.current_frame--;
			        if (this.current_frame == -1) {
			            this.current_frame = 1;
			            this.pingpong_direction = 1;

			            this.current_loop++;

			            if (typeof this.callback === "function") this.callback();

			            if (this.loops > 0 && this.current_loop >= this.loops) {
				    		return 1;
				    	}
			        }
			    }
			} else {
			    this.current_frame++;
			    if (this.current_frame == this.total_frames) {
			    	if (typeof this.callback === "function") this.callback();
			    	this.current_loop++;

			    	this.current_frame = 0;

			    	if (this.loops > 0 && this.current_loop >= this.loops) {
			    		return 1;
			    	}
			    }
			}
			var self = this;
			this.timeout = setTimeout(function() { self.Animate() }, this.interval);
		} else {
			this.current_frame = 0;
		}
		return this;
	}
})(window.BeatEmUp = window.BeatEmUp || {} , jQuery);
