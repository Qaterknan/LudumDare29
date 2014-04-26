{
	assets : {
		"player": "/textures/zombie1.png",
		"weapon" : "/textures/provizorniZbran.png",
		"pistol-bullet": "/textures/bullet.png",
		"terminal": "/textures/terminal-modra.png",
		"zdi": "/textures/zdi-modra.png",
		"pozadi": "/textures/lod-modra.png",
	},
	preload : function (game){
		
	},
	afterload : function (game){

		var player = new Player({
			position: new Vec2(0, 0),
			width: 20,
			height: 20,
			friction: new Vec2(10,0),
			gravity: new Vec2(0, 1000),
			texture: new Texture(game.loader.get("player"), {
				totalFrames: 4,
				currentAnimation: "walking",
				animations: {
					"standing" : {
						delay: 50,
						start: 0,
						end: 0
					},
					"walking" : {
						delay: 250,
						start: 0,
						end: 1
					},
					"death" : {
						delay: 400,
						start: 1,
						end: 3
					}
				}
			})
		});

		player.weapon = weapons.pistol;

		player.addKeyboardControl("D", function(){
			player.accelerate(1);
		});
		player.addKeyboardControl("A", function(){
			player.accelerate(-1);
		});
		player.addKeyboardControl("W", function(){
			player.jump();
		});
		player.addKeyboardControl(" ", function(){
			player.shoot();
		});

		player.debug = false;

		var background = new Background({
			position: new Vec2(0, 0),
			width: game.width,
			height: game.height,
			texture: new Texture(game.loader.get("pozadi"), {
				repeat: true,
				width: game.width,
				height: game.height,
			})
		});
		game.world.add(background);

		var terminal = new Background({
			position: new Vec2(0, 0),
			width: 30,
			height: 30,
			texture: new Texture(game.loader.get("terminal"), {
				repeat: true,
			})
		});
		game.world.add(terminal);

		var platform = new Platform({
			position: new Vec2(0, 120),
			width: game.width,
			height: 20,
			texture: new Texture(game.loader.get("zdi"), {
				width: game.width,
				repeat: true
			})
		});
		// platform.debug = true;
		game.world.add(platform);

		game.world.add(player);
		var platform2 = new Platform({
			position: new Vec2(200, 70),
			width: 100,
			height: 20,
			texture: new Texture(game.loader.get("zdi"), {
				width: 100,
				repeat: true
			})

		});
		// platform2.debug = true;
		game.world.add(platform2);

		var HP = new HealthBar({
			position : new Vec2(-180,130),
			width: 150,
			height : 20,
			fillColor : new Color("5AF2F0"),
			hurtColor : new Color("F0FA2D"),
			healColor : new Color("2DFA64"),
			bgColor : "black",
			negativeMax : 0,
			player : player,
		});
		
		game.world.add(HP);
		
		
		
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
	},
}