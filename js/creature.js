function Creature(options){
	Object2D.call(this, options);

	this.colliding = true;

	this.accel = 700;
	this.friction = 10;
	this.maxSpeed = 300; //5px/s
	this.midJumpingDownForce = 1000;
	this.jumpingAccel = 35000;
	this.accelerating = false;

	this.lookingDirection = 1;

	this.weapon = false;

	this.onPlatform = false;
	this.onCollision = function(object) {
		if(object instanceof Platform){
			this.onPlatform = true;
			this.bottom = object.top;
		}
	};
	
	this.health = options.health === undefined ? 100 : options.health;
	this.maxHealth = options.health === undefined ? 100 : options.maxHealth;
}

Creature.prototype = Object.create( Object2D.prototype );

Creature.prototype.accelerate = function(direction) {
	this.accelerating = true;
	this.lookingDirection = direction;
	this.texture.scale.x = direction;
	if(this.velocity.x * direction > 0){
		this.acceleration.x += direction*this.accel;
	}
	else {
		this.acceleration.x += direction*this.accel*10;
	}
};

Creature.prototype.jump = function() {
	this.jumping = true;
	if(this.onPlatform)
		this.acceleration.y = -this.jumpingAccel;
};

Creature.prototype.tick = function(dt) {
	// Object2D.prototype.tick.call(this, dt);

	this.acceleration.add(this.gravity);

	var velocityLength = this.velocity.length();
	// this.acceleration.x -= this.velocity.x*velocityLength*this.friction.x*dt;
	// this.acceleration.y -= this.velocity.y*velocityLength*this.friction.y*dt;
	if(!this.accelerating){
		this.velocity.x *= 0.9;
	}

	if(!this.jumping && !this.onPlatform){
		this.acceleration.y += this.midJumpingDownForce;
	}
	// console.log(this.acceleration)
	this.velocity.x += this.acceleration.x*dt;
	this.velocity.y += this.acceleration.y*dt;


	if(this.velocity.x > this.maxSpeed){
		this.velocity.x = this.maxSpeed;
	}
	else if(this.velocity.x < -this.maxSpeed){
		this.velocity.x = -this.maxSpeed;
	}

	if(this.onPlatform){
		this.velocity.y = Math.min(0, this.velocity.y);
	}

	this.position.x += this.velocity.x*dt;
	this.position.y += this.velocity.y*dt;

	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.tick(dt);
	}

	this.acceleration.set(0, 0);
	this.onPlatform = false;
	this.accelerating = false;
	this.jumping = false;
};

Creature.prototype.shoot = function() {
	if(this.weapon){
		game.world.camera.shake(2, 100);
		this.weapon.shoot(this, this.parent);
	}
};

Creature.prototype.takeDamage = function (amount){
	this.health -= amount;
};

Creature.prototype.heal = function (amount){
	this.health += amount;
};
