function World(options){
	Object2D.call(this, options);

	// this.game = this.options.game;

	this.camera = new Camera();
}

World.prototype = Object.create( Object2D.prototype );

World.prototype.render = function(ctx) {
	ctx.save();

	// díky tomuto ukazuje kamera doprostřed obrazovky
	ctx.translate(this.width/2, this.height/2);
	
	ctx.scale(this.camera.scale.x, this.camera.scale.y);
	ctx.translate(-this.camera.position.x, -this.camera.position.y);
	Object2D.prototype.render.call(this, ctx);

	ctx.restore();
};