function Creature(options){
	Object2D.call(this, options);

	this.colliding = true;

	this.onPlatform = false;
	this.onCollision = function(object) {
		if(object instanceof Platform){
			console.log("fuck")
			// this.onPlatform = true;
		}
	};
}

Creature.prototype = Object.create( Object2D.prototype );


Creature.prototype.tick = function(dt) {
	// if(this.onPlatform){
	// 	this.gravity.set(0, 0);
	// }
	Object2D.prototype.tick.call(this, dt);

	// this.onPlatform = false;
};