;(function (BeatEmUp) {

	console.log("IMAGEZZZZZZ");

	var url ="images/";
	var ext = ".png";

	var load_img = function (filename) {
		var img = new Image();
		img.src = url + filename + ext;
		return img;
	}

	BeatEmUp.Images = {

		dudeWalk: load_img("dude-walk")

	}

})(window.BeatEmUp || {});