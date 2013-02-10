;(function (BeatEmUp) {

	var url ="images/";
	var ext = ".png";

	var load_img = function (filename) {
		var img = new Image();
		img.src = url + filename + ext;
		return img;
	}

	BeatEmUp.Images = {

		dudeWalk: load_img("dude-walk"),
		dude2Walk: load_img("dude2-walk"),
		dude2Punch: load_img("dude2-punch")

	}

})(window.BeatEmUp = window.BeatEmUp || {});