;(function (BeatEmUp) {

	var url ="/images/";
	var ext = ".png";

	var load_img = function (filename) {
		var img = new Image();
		img.src = url + filename + png;
		return img;
	}

	BeatEmUp.Images = {

		monsterImage: load_img("monster"),
		
		ballImage: load_img("ball"),

		weaponImage: load_img("weapon")

	}

})(window.BeatEmUp = window.BeatEmUp || {});