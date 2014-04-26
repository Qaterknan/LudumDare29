function World(options){
	Object2D.call(this, options);

	// this.game = this.options.game;

	this.camera = new Camera();
	var _this = this;
	// this.addKeyboardControl("S", function(){
	// 	_this.camera.position.y = _this.camera.position.y + 3;
	// });
	// this.addKeyboardControl("W", function(){
	// 	_this.camera.position.y = _this.camera.position.y - 3;
	// });
	// this.addKeyboardControl("A", function(){
	// 	_this.camera.position.x = _this.camera.position.x - 3;
	// });
	// this.addKeyboardControl("D", function(){
	// 	_this.camera.position.x = _this.camera.position.x + 3;
	// });
}

World.prototype = Object.create( Object2D.prototype );

World.prototype.tick = function(dt) {
	Object2D.prototype.tick.call(this, dt);

	this.checkChildrenCollisions();
};

World.prototype.render = function(ctx) {
	ctx.save();

	// díky tomuto ukazuje kamera doprostřed obrazovky
	ctx.translate(this.width/2, this.height/2);
	
	ctx.scale(this.camera.scale.x, this.camera.scale.y);
	ctx.translate(-this.camera.position.x, -this.camera.position.y);
	Object2D.prototype.render.call(this, ctx);

	ctx.restore();
};

World.prototype.handleMouseEvent = function(which, type, x,y){
	if(this.mouseControls[which]){
		this.mouseControls[which].exec(type,x,y);
	}
	var vec = new Vec2(x-this.width/2+this.camera.position.x,y-this.height/2+this.camera.position.y);
	vec.rotate(-this.rotation);
	vec.x = vec.x/this.camera.scale.x;
	vec.y = vec.y/this.camera.scale.y;
	for(var i = 0; i < this.children.length; i++){
		this.children[i].handleMouseEvent(which, type, vec.x, vec.y);
	};
}