function Game(width, height, canvas){
	this.width = width;
	this.height = height;

	canvas.width = width;
	canvas.height = height;
	$(canvas).center();

	this.renderer = new CanvasRenderer(this.width, this.height, canvas);
	this.eventhandler = new Eventhandler(canvas);
	this.world = new World(game);

	this.canvas = canvas;

	this.raf = null;

	this.lastTime = Date.now();

	this.simulationSpeed = 1;

	this.paused = false;
}

Game.prototype.start = function() {
	this.paused = false;
	this.lastTime = Date.now();
	this.update();
};

Game.prototype.stop = function() {
	this.paused = true;
};

Game.prototype.update = function() {
	stats.begin();
	var _this = this;
	var now = Date.now();
	var dt = now - this.lastTime;
	this.lastTime = now;
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
};