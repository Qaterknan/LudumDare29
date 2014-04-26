function Creature(options){
	Object2D.call(this, options);
}

Creature.prototype = Object.create( Object2D.prototype );