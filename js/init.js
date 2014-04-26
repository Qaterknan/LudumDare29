function statsInit(){
	window.stats = new Stats();
	stats.setMode(1); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	$("body").append( stats.domElement );

	return stats;

	// stats.begin();
	// stats.end();
}

function datguiInit(){
	window.gui = new dat.GUI();

	return gui;
}

var game;

$(document).ready(function(){
	statsInit();
	// datguiInit();

	var canvas = document.createElement("canvas");
	$("body").append(canvas);

	game = new Game(480, 320, canvas);
	
	game.loader.load({
		"anim": "animation.png",
		"test_sound": "test.mp3",
		"test_json": "test.json"
	}, function(){

		var player = new Player({
			position: new Vec2(0, 0),
			width: 120,
			height: 148,
			friction: new Vec2(10,10),
			// gravity: new Vec2(0, 1000),
			texture: new Texture(game.loader.get("anim"), {
				totalFrames: 27,
				currentAnimation: "standing",
				animations: {
					"standing" : {
						delay: 50,
						start: 0,
						end: 0
					},
					"walking" : {
						delay: 50,
						start: 0,
						end: 26
					}
				}
			})
		});

		player.addKeyboardControl("D", function(){
			player.acceleration.x = 5000;
		});
		player.addKeyboardControl("A", function(){
			player.acceleration.x = -5000;
		});
		player.addKeyboardControl("W", function(){
			player.acceleration.y = -5000;
		});
		player.addKeyboardControl("S", function(){
			player.acceleration.y = 5000;
		});

		player.debug = true;

		var player2 = new Player({
			position: new Vec2(170, 0),
			width: 120,
			height: 148,
			texture: new Texture(game.loader.get("anim"), {
				totalFrames: 27,
				currentAnimation: "walking",
				animations: {
					"walking" : {
						delay: 50,
						start: 0,
						end: 26
					}
				}
			})
		});

		var platform = new Platform({
			position: new Vec2(0, 140),
			width: game.width,
			height: 20,
		});
		platform.debug = true;

		game.world.add(player);
		// game.world.add(player2);
		game.world.add(platform);

		game.start();
	});

});
