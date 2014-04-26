function Bullet(options){
	Object2D.call(this, options);

	this.life = 2; // sekundy
	this.colliding = true;

	this.texture.onAnimationEnd = function(){
		this.switchAnimation("static");
	}

	this.onCollision = function(object){
		var _this = this;
		if(!(object instanceof Player) && !(object instanceof Bullet)){
			this.velocity.set(0, 0);
			this.acceleration.set(0, 0);

			this.texture.switchAnimation("destroy");
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