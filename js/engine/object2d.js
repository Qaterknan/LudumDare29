function Object2D(options){
	options = options === undefined ? {} : options;

	this.position = options.position === undefined ? new Vec2() : options.position;
	this.velocity = options.velocity === undefined ? new Vec2() : options.velocity;
	this.acceleration = options.acceleration === undefined ? new Vec2() : options.acceleration;
	this.rotation = options.rotation === undefined ? 0 : options.rotation;
	this.angularVelocity = options.angularVelocity === undefined ? 0 : options.angularVelocity;
	this.width = options.width === undefined ? 1 : options.width;
	this.height = options.height === undefined ? 1 : options.height;
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