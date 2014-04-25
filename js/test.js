function TesterObject(options){
	Object2D.call(this, options);
	
	this.color = "#000";
}

TesterObject.prototype = Object.create( Object2D.prototype );

TesterObject.prototype.render = function(ctx) {
	Object2D.prototype.render.call(this, ctx);

	ctx.fillStyle = this.color;
	ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
};