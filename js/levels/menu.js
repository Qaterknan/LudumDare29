{
	assets : {
		
	},
	preload : function (game){
		var val = "Loading ...";
		var font = "sans-serif";
		var size = "40";
		var ctx = game.renderer.ctx;
		ctx.font = size+"px "+font;
		var delka = ctx.measureText(val).width;
		var loadingText = new GUIText({
			position : new Vec2(-delka/2,-100),
			font : font,
			size : size,
			text : val,
			width : 300,
			height : 50,
		});
		
		game.world.add(loadingText);
		
		var prog = new ProgressBar({
			position : new Vec2(0,0),
			width : 500,
			height : 20,
			offset : 1,
			value : game.loader.loaded,
			maxValue : game.loader.toLoad,
		});
		prog.tick = function(dt){
			ProgressBar.prototype.tick.call(this, dt);
			this.value = game.loader.loaded;
		}
		
		game.world.add(prog);
	},
	afterload : function (game){
		game.world.children = [];
		
		var playText = new GUIText({
			position : new Vec2(0,0),
			width : 100,
			height : 50,
			text : "PLAY",
			size : 32,
			color : "white",
		});
		
		var button = new GUILabel({
			position : new Vec2(0,-100),
			width : 110,
			height : 60,
			color : "black",
			onclick : function (){
				console.log("how about now?");
			}
		});
		button.add(playText);
		game.world.add(button);
	},
}