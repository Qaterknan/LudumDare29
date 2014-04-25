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

	var tester2 = new TesterObject({
		position: new Vec2(10, 10),
		width: 100,
		height: 10
	});

	tester.add(tester2);

	game.world.add(tester);

	game.start();
});
