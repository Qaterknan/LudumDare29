function Zombie(options){
	Creature.call(this, options);
}

Zombie.prototype = Object.create( Creature.prototype );

Zombie.prototype.tick = function(dt) {
	if(Math.random() < 0.03)
		this.jump();
	if(Math.random() < 0.06)
		this.accelerate(utils.randInt(0,1)*2-1)
	Creature.prototype.tick.call(this, dt);
	// console.log("ahoj")
};

Zombie.prototype.onCollision = function(object) {
		if(object instanceof Platform){
			
			// pokud stojí
			if(object.pointIn(this.position.x, this.position.y+this.height/2)){
				this.onPlatform = true;
				this.bottom = object.top;
			}
			else {
				if(object.pointIn(this.position.x, this.position.y-this.height/2)){
					this.top = object.bottom;
					this.velocity.y += 100;
				}
				else {
					var dx = this.position.x - object.position.x;
					if(dx > 0){
						this.left = object.right;
					}
					else {
						this.right = object.left;
					}
				}
			}
		}
	};