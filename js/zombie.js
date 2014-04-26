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