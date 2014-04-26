function Zombie(options){
	Creature.call(this, options);
}

Zombie.prototype = Object.create( Creature.prototype );