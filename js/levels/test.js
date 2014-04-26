{
	assets : {
		"anim": "/textures/animation.png",
		"test_sound": "test.mp3",
		"test_json": "test.json",
	},
	preload : function (game){
		
	},
	afterload : function (game){
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
		
		var text = new GUIText({
			position : new Vec2(300,300),
			width : 100,
			height : 50,
			color : "#00ff00",
			text : "Hello, world! How are you? I am fine!",
			size : 15,
		});
		game.world.add(text);
		
		var prog = new ProgressBar({
			position : new Vec2(-50,-70),
			width : 100,
			height : 20,
			value : 50,
			maxValue : 70,
			negativeMaxValue : -70,
		});
		game.world.add(prog);
		
	},
}