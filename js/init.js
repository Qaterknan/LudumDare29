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

	game = new Game(320, 320, canvas);

	var tester = new TesterObject({
		position: new Vec2(10, 10),
		width: 100,
		height: 100
	});
	tester.addMouseControl(0, function(x,y){
		if((x > tester.position.x && x < tester.width+tester.position.x) && (y > tester.position.y && y < tester.width+tester.position.y)){
			tester.color = "#f00";
		}
		else{
			tester.color = "#000";
		}
		});
	
	
	var tester2 = new TesterObject({
		position: new Vec2(10, 10),
		width: 100,
		height: 10
	});
	game.loader.load({
		"anim": "animation.png",
		"test_sound": "test.mp3",
		"test_json": "test.json"
	}, function(){
		var tester = new TesterObject({
			position: new Vec2(100, 100),
			width: 120,
			height: 148,
			texture: new Texture(game.loader.get("anim"), {
				totalFrames: 27,
				currentAnimation: "walking",
				animations: {
					"walking" : {
						speed: 50,
						start: 0,
						end: 26
					}
				}
			})
		});
		game.world.add(tester);

		game.start();
	});

});
