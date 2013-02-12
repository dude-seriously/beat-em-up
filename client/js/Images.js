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
		dudePunch: load_img("dude-punch"),
		dude2Punch: load_img("dude2-punch"),
		dudeCorpse: load_img("dude-corpse"),
		dude2Corpse: load_img("dude2-corpse"),
		chicken: load_img("chicken"),
		dudeHold: load_img("dude-hold"),
		dude2Hold: load_img("dude2-hold")
	}

})(window.BeatEmUp = window.BeatEmUp || {});