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
						delay: 50,
						start: 0,
						end: 26
					}
				}
			})
		});
		game.world.add(tester);
		
		var label = new GUILabel({
			position : new Vec2(200,200),
			width: 50,
			height: 50,
			color : "#256521",
			onmousein: function (){
				this.color = "#f00";
			},
			onmouseout: function(){
				this.color = "#256521";
			},
			rotation : 0.3,
		});
		game.world.add(label);
		
		var label2 = new GUILabel({
			position : new Vec2(0,-70),
			width: 50,
			height: 50,
			color : "#482356",
			onclick : function(){
				console.log("hurray");
			}
		});
		label.add(label2);

		var ps = new ParticleSystem({
			position: new Vec2(30, 30),
			width: 100,
			height: 100
		},
		{
			size: 2,
			update: function(){
				Particle.prototype.update.call(this);
				this.color.r += utils.randFloat(0.001, 0.05);
			}
		},
		{
			emiting: true,
			amount: 10,
			randomize: {
				velocity: function(){
					return new Vec2(utils.randFloatSpread(2), utils.randFloatSpread(2));
				},
				life: function(){
					return utils.randInt(5000, 10000);
				}
			}
		});

		game.world.add(ps);

		game.start();
	});

});
