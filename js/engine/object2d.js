function Object2D(options){
	this.options = options === undefined ? {} : options;

	this.position = this.options.position === undefined ? new Vec2() : this.options.position;
	this.velocity = this.options.velocity === undefined ? new Vec2() : this.options.velocity;
	this.acceleration = this.options.acceleration === undefined ? new Vec2() : this.options.acceleration;
	this.rotation = this.options.rotation === undefined ? 0 : this.options.rotation;
	this.angularVelocity = this.options.angularVelocity === undefined ? 0 : this.options.angularVelocity;
	this.width = this.options.width === undefined ? 1 : this.options.width;
	this.height = this.options.height === undefined ? 1 : this.options.height;
	this.parent = null;
	this.children = [];
}

Object2D.prototype.tick = function(dt) {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.tick(dt);
	}
};

Object2D.prototype.render = function(ctx) {
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.render(ctx);
	}
	ctx.restore();
};

Object2D.prototype.add = function(child) {
	this.children.push(child);
	child.parent = this;
};

Object2D.prototype.removeChildren = function() {
	this.children = [];
};