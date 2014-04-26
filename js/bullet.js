function Bullet(options){
	Object2D.call(this, options);

	this.life = 2; // sekundy
	this.colliding = true;
	this.holder = options.holder;
	this.damage = options.damage === undefined ? 1 : options.damage;

	this.texture.onAnimationEnd = function(){
		this.switchAnimation("static");
	}

	this.onCollision = function(object){
		var _this = this;
		if(!(object == this.holder) && !(object instanceof Bullet)){
			this.velocity.set(0, 0);
			this.acceleration.set(0, 0);

			this.texture.switchAnimation("destroy");
			if(object instanceof Creature)
				object.takeDamage(this.damage);
			this.texture.onAnimationEnd = function(){
				_this.parent.remove(_this);
			}
		}
	};
}

Bullet.prototype = Object.create( Object2D.prototype );

Bullet.prototype.tick = function(dt) {
	this.life-=dt;
	if(this.life < 0){
		this.parent.remove(this);
	}
	Object2D.prototype.tick.call(this, dt);
};