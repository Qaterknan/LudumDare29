{
	assets : {
		"player": "/textures/zombie1.png",
		"zombie": "/textures/zombie1.png",
		"pistol" : "/textures/provizorniZbran.png",
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
			friction: new Vec2(10, 0),
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
		game.world.add(platform);

		var platform2 = new Platform({
			position: new Vec2(200, 70),
			width: 100,
			height: 20,
			texture: new Texture(game.loader.get("zdi"), {
				width: 100,
				repeat: true
			})

		});
		game.world.add(platform2);

		var zombie = new Zombie({
			position: new Vec2(40, 0),
			width: 20,
			height: 20,
			friction: new Vec2(10,0),
			gravity: new Vec2(0, 1000),
			texture: new Texture(game.loader.get("zombie"), {
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
		game.world.add(zombie);

		game.world.add(player);

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
		
		var weapon = new GUILabel({
			position : new Vec2(0,-50),
			width : 50,
			height : 50,
			color : "black",
			onmousein : function (){
				this.color = "blue";
			},
			onmouseout : function (){
				this.color = "black";
			},
			/*texture : new Texture(
				game.loader.get(player.weapon.options.textureName),
				{scale : new Vec2(3,3)}
			),*/
		});
		
		game.world.add(weapon);
	},
}