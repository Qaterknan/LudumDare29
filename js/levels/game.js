{
	assets : {
		"anim": "/textures/animation.png",
		"test_sound": "test.mp3",
		"test_json": "test.json",
		"pistol" : "/textures/provizorniZbran.png",
		"pistol-bullet": "/textures/bullet.png",
	},
	preload : function (game){
		
	},
	afterload : function (game){

		var player = new Player({
			position: new Vec2(0, 0),
			width: 120,
			height: 148,
			friction: new Vec2(10,0),
			gravity: new Vec2(0, 1000),
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
		var platform2 = new Platform({
			position: new Vec2(200, 70),
			width: game.width/7,
			height: 100,
		});
		platform2.debug = true;
		game.world.add(platform2);
		game.world.add(platform);

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