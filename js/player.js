function Player(options){
	Creature.call(this, options);
}
Player.prototype = Object.create( Creature.prototype );
