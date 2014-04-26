function Player(options){
	Creature.call(this, options);
	
	this.weapon = {
		name: "Handgun",
	};
}

Player.prototype = Object.create( Creature.prototype );

Player.prototype.takeDamage = function (amount){
	this.health -= amount;
	if(this.healthBar)
		this.healthBar.hurt = new Date().getTime();
};

Player.prototype.heal = function (amount){
	this.health += amount;
	if(this.healthBar)
		this.healthBar.healed = new Date().getTime();
};
