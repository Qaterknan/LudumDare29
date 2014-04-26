{
	assets : {
		"player": "./textures/mariner.png",
		"player-shoot": "./textures/marinershoot.png",
		"zombie": "./textures/zombie1.png",
		
		"samopal" : "./textures/weapons/samo.png",
		"flame" : "./textures/weapons/plamenomet.png",
		"pistol" : "./textures/weapons/pistole.png",
		"kulomet" : "./textures/weapons/machinegun.png",
		"brokovnice" : "./textures/weapons/brok.png",
		"pistol-bullet": "./textures/bullet.png",
		
		"terminal": "./textures/terminal-modra.png",
		"zdi": "./textures/zdi-modra.png",
		"pozadi": "./textures/lod-modra.png",
		
		"healthIcon": "./textures/healthIcon.png",
		
		"genericShot": "./sounds/beep.wav",
		
	},
	preload : function (game){
		
	},
	afterload : function (game){

		var player = new Player({
			position: new Vec2(0, 0),
			width: 20,
			height: 40,
			friction: new Vec2(10, 0),
			gravity: new Vec2(0, 1000),
			texture: new Texture(game.loader.get("player-shoot"), {
				totalFrames: 4,
				currentAnimation: "walking",
				animations: {
					"standing" : {
						delay: 50,
						start: 0,
						end: 0
					},
					"walking" : {
						delay: 150,
						start: 0,
						end: 3
					},
					// "death" : {
					// 	delay: 400,
					// 	start: 1,
					// 	end: 3
					// }
				}
			})
		});

		game.world.camera.follow(player);
		game.world.camera.scale.set(3,3);

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
			position : new Vec2(
				-0.30*game.canvas.width,
				0.37*game.canvas.height),
			width: 0.25*game.canvas.width,
			height : game.canvas.height*0.08,
			offset : 5,
			fillColor : new Color("5AF2F0"),
			hurtColor : new Color("F0FA2D"),
			healColor : new Color("2DFA64"),
			bgColor : "black",
			fixed: true,
			negativeMax : 0,
			player : player,
		});
		
		var ikona = new GUILabel({
			position : new Vec2(-game.canvas.height*0.32, 0),
			height : 0,
			width : 0,
			texture : new Texture(game.loader.get("healthIcon"), {scale : new Vec2(3,3)}),
		});
		
		HP.add(ikona);
		game.world.add(HP);
		
		var weapon = new GUILabel({
			position : new Vec2(-0.12*game.canvas.width,0.37*game.canvas.height),
			width : 0,
			height : 0,
			texture : new Texture(
				game.loader.get(player.weapon.options.textureName),
				{scale : new Vec2(2,2)}
			),
			fixed : true,
		});
		game.world.add(weapon);
		var ammo = new AmmoBar({
			position : new Vec2(0.07*game.canvas.width,0.37*game.canvas.height),
			width : 0.25*game.canvas.width,
			height : 0.08*game.canvas.height,
			fixed: true,
			offset : 5,
			fillColor : "#FFD117",
			weapon : player.weapon,
		});
		game.world.add(ammo);
		
	},
}