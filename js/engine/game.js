function Game(width, height, canvas){
	this.width = width;
	this.height = height;

	canvas.width = width;
	canvas.height = height;
	$(canvas).center();

	this.renderer = new CanvasRenderer(this.width, this.height, canvas);
	this.loader = new Loader();
	this.tweens = new TweenManager();
	this.world = new World({
		width: this.width,
		height: this.height,
		game: this
	});
	this.eventhandler = new Eventhandler(canvas, this.world);

	this.canvas = canvas;

	this.raf = null;

	this.time = Date.now();

	// nefunguje < 1
	this.simulationSpeed = 1;

	this.paused = false;
}

// Vypne interpolaci canvasu = lepší pro pixelart
Game.prototype.disableInterpolation = function() {
	this.ctx.webkitImageSmoothingEnabled = this.ctx.mozImageSmoothingEnabled = false;
};

Game.prototype.start = function() {
	this.paused = false;
	this.time = Date.now();
	this.update();
};

Game.prototype.stop = function() {
	this.paused = true;
};

Game.prototype.update = function() {
	stats.begin();
	var _this = this;
	var now = Date.now();
	var dt = now - this.time;
	this.time = now;
	if(!this.paused){
		this.raf = requestAnimationFrame(function(){
			_this.update();
		});
		this.eventhandler.loop();
		for(var i=0;i<this.simulationSpeed;i++){
			this.world.tick(dt/1000);
		}
	}
	this.renderer.render(this.world);
	stats.end();
	// console.log(parent);
};