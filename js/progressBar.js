function TesterObject(options){
	Object2D.call(this, options);

	this.ratio = 0;
}

TesterObject.prototype = Object.create( Object2D.prototype );

TesterObject.prototype.render = function(ctx) {
	Object2D.prototype.render.call(this, ctx);

	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.fillStyle = "#000"
	ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
	this.texture.draw(ctx);
	ctx.restore();
};