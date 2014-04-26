function Object2D(options){
	this.options = options === undefined ? {} : options;

	this.position = this.options.position === undefined ? new Vec2() : this.options.position;
	this.velocity = this.options.velocity === undefined ? new Vec2() : this.options.velocity;
	this.acceleration = this.options.acceleration === undefined ? new Vec2() : this.options.acceleration;
	this.friction = this.options.friction === undefined ? new Vec2() : this.options.friction;
	this.gravity = this.options.gravity === undefined ? new Vec2() : this.options.gravity;
	this.rotation = this.options.rotation === undefined ? 0 : this.options.rotation;
	this.angularVelocity = this.options.angularVelocity === undefined ? 0 : this.options.angularVelocity;
	this.width = this.options.width === undefined ? 1 : this.options.width;
	this.height = this.options.height === undefined ? 1 : this.options.height;
	this.texture = this.options.texture === undefined ? false : this.options.texture;
	
	this.debug = false;

	this.parent = null;
	this.children = [];

	this.colliding = this.options.colliding === undefined ? false : this.options.colliding;
	this.onCollision = this.options.onCollision === undefined ? function(){} : this.options.onCollision;
	
	this.keyboardControls = {};
	this.mouseControls = {};
}

Object2D.prototype.tick = function(dt) {
	this.acceleration.add(this.gravity);

	var velocityLength = this.velocity.length();
	this.acceleration.x -= this.velocity.x*velocityLength*this.friction.x*dt;
	this.acceleration.y -= this.velocity.y*velocityLength*this.friction.y*dt;

	this.velocity.x += this.acceleration.x*dt;
	this.velocity.y += this.acceleration.y*dt;

	this.position.x += this.velocity.x*dt;
	this.position.y += this.velocity.y*dt;

	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.tick(dt);
	}

	this.acceleration.set(0, 0);
};

Object2D.prototype.render = function(ctx) {
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.rotation);
	if(this.texture)
		this.texture.draw(ctx);
	if(this.debug){
		ctx.strokeStyle = "#4DE352";
		ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
	}
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

Object2D.prototype.pointIn = function (x,y){
	var vec = new Vec2(x-this.position.x, y-this.position.y);
	vec.rotate(-this.rotation);
	return (vec.x >= -this.width/2 && vec.x <= this.width/2) && (vec.y >= -this.height/2 && vec.y <= this.height/2);
};

Object2D.prototype.checkRectangleCollision = function(object) {
	if(this == object)
		return false;
	
	var thisLeft = this.position.x - this.width/2;
	var thisTop = this.position.y - this.height/2;
	var thisRight = this.position.x + this.width/2;
	var thisBottom = this.position.y + this.height/2;
	var objectLeft = this.position.x - this.width/2;
	var objectTop = this.position.y - this.height/2;
	var objectRight = object.position.x + object.width/2;
	var objectBottom = object.position.y + object.height/2;

	return !(objectLeft > thisRight || objectRight < thisLeft || objectTop > thisBottom || objectBottom < thisTop);
};

Object2D.prototype.checkChildrenCollisions = function() {
	for(var i=0; i<this.children.length-1; i++){
		for(var j=i+1; j<this.children.length; j++){
			if(this.children[i].colliding && this.children[j].colliding){
				var collision = this.children[i].checkRectangleCollision(this.children[j]);
				if(collision){
					this.children[i].onCollision(this.children[j]);
					this.children[j].onCollision(this.children[i]);
				}
			}
		}
	}
};

Object2D.prototype.handleKeyEvent = function (key, type){
	if(this.keyboardControls[key]){
		this.keyboardControls[key].exec(type);
	}
	for(var i = 0; i < this.children.length; i++){
		this.children[i].handleKeyEvent(key, type);
	};
};

Object2D.prototype.handleMouseEvent = function (key, type, x, y){
	if(this.mouseControls[key]){
		this.mouseControls[key].exec(type,x,y);
	}
	var vec = new Vec2(x-this.position.x,y-this.position.y);
	vec.rotate(-this.rotation);
	for(var i = 0; i < this.children.length; i++){
		this.children[i].handleMouseEvent(key, type, vec.x, vec.y);
	};
};

Object2D.prototype.addMouseControl = function (which, down, up, continuous){
	 if(!this.mouseControls[ which ])
                this.mouseControls[ which ] = new Mouse( down, up, continuous );
        else{
                this.mouseControls[ which ].add(down, "mousedown");
                this.mouseControls[ which ].add(up, "mouseup");
                this.mouseControls[ which ].add(continuous, "continuous");
        }
};

Object2D.prototype.addKeyboardControl = function (_key, down, up, continuous){
	if(typeof(_key) == "string"){
                key = _key.charCodeAt(0);
        }
        else {
                key = _key;
        }
        if(!this.keyboardControls[ key ])
            this.keyboardControls[ key ] = new Key( down, up, continuous );
        else{
            this.keyboardControls[ key ].add(down, "keydown");
            this.keyboardControls[ key ].add(up, "keyup");
            this.keyboardControls[ key ].add(continuous, "continuous");
        }
};