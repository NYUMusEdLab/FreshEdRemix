/**
 *  Forking from Tommy Payne, hacking at the NYC Monthly Music Hackathon 3/28/2015
 *  Using Tone.JS and NexusUI
 *
 *  by Lee Tusman, Tim Bieniosek, Jason Sigal
 */

		var loaded = 0;

		// SETUP TONE
		// default playback rates
		var player1Rate = 0.7;
		var player2Rate = 0.7;

		var player1 = new Tone.Player("./samples/predict_instr.mp3", function(){
			loaded++;
			sampleLoaded();
		});

		var player2 = new Tone.Player("./samples/predict.mp3", function(){
			loaded++;
			sampleLoaded();
		});

		var airHorn = new Tone.Player("./samples/airhorn.mp3", function() {
			loaded++;
			sampleLoaded();
		});

		function sampleLoaded(e){
			if (loaded ===4){
				console.log("loaded sample: " + e);
			}
		}

		//invoked when the queued sample is done loading
		Tone.Buffer.onload = function(){
			player1.start();
			player1.output.gain.value = 3;
			player2.start();
			player2.output.gain.value = 3;
			console.log("everything is loaded");
		};

		var fader = new Tone.CrossFade(0.5);
		player1.connect(fader, 0, 0);
		player2.connect(fader, 0, 1);
		fader.toMaster();

		player1.loop = true;
		player2.loop = true;
		player1.retrigger = true;
		player2.retrigger = true;

		airHorn.toMaster();
		airHorn.retrigger = true;

		nx.onload = function(){

			nx.colorize("#00CCFF"); // sets accent (default)
			nx.colorize("border", "#222222");
			nx.colorize("fill", "#222222");

			vinyl1.colors.accent = "#FF00CC";
			vinyl1.draw();

			vinyl1.on("*", function(data){
				//callback inside the function 
				//next line of code is where the mp3 PBR is mapped to the speed of the Vinyl object
				//we are changing the players PBR based on the user interaction speed of the Vinyl GUI
				player1.playbackRate = Math.abs( (data.speed * 0.5) * (player1Rate * 2) );
			});

			vinyl2.on("*", function(data){
				player2.playbackRate = data.speed * player2Rate;
			});

			tt1Slider.on("*", function(data) {
				player1Rate = map(data.value, 1, 0, 1.5, 0.7);
				player1.playbackRate = player1Rate;
			});

			tt2Slider.on("*", function(data) {
				player2Rate = map(data.value, 1, 0, 1.5, 0.7);
				player2.playbackRate = player2Rate;
			});

			crossfader.on("*", function(data) {
				// console.log(data.value);
				fader.fade.value = data.value;
			});

	}; // end nx-onload

// HELPER METHODS
var map = function (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

var constrain = function (n, low, high) {
  return Math.max(Math.min(n, high), low);
};

window.onkeydown = function(e) {
	switch(e.which) {
		case 32:
			airHorn.stop(0);
			airHorn.start(0.02);
	}
};