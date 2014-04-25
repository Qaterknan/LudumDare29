function TesterObject(options){
	Object2D.call(this, options);
}

TesterObject.prototype = Object.create( Object2D.prototype );

TesterObject.prototype.render = function(ctx) {
	Object2D.prototype.render.call(this, ctx);

	ctx.fillStyle = "#000"
	ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
};