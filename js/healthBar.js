function HealthBar(options){
	ProgressBar.call(this, options);

	this.player = options.player === undefined ? {health : 100, maxHealth: 100} :  options.player;
	this.player.healthBar = this;
	
	this.fillColor = new Color("#56ECFC");
	this.hurtColor = new Color("#F0FA34");
	this.healColor = new Color("56FC64");
	
	this.delay = options.delay === undefined ? 400 : options.delay;
	this.lastHealth = this.player.health;
	this.hurt = false;
	this.healed = false;
}

HealthBar.prototype = Object.create( ProgressBar.prototype );

HealthBar.prototype.render = function (ctx){
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.rotation);
	ctx.fillStyle = this.bgColor;
	ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
	ctx.fillStyle = this.getColor();
	ctx.fillRect(-this.width/2+this.offset, -this.height/2+this.offset,(this.width-2*this.offset)*this.getUpdatedRatio(), this.height-2*this.offset);
	ctx.restore();
	Object2D.prototype.render.call(this, ctx);
};

HealthBar.prototype.getColor = function (){
	var now = new Date().getTime();
	if(this.hurt && now > this.hurt+this.delay){
		this.hurt = false;
	}
	if(this.healed && now > this.healed+this.delay){
		this.healed = false;
	}
	var mez = new Color();
	if(this.hurt || this.healed){
		if(this.hurt && !this.healed)
			mez.copy(this.hurtColor).lerp(this.fillColor, (now-this.hurt)/this.delay);
		if(this.healed && !this.hurt)
			mez.copy(this.healColor).lerp(this.fillColor, (now-this.healed)/this.delay);
		if(this.healed && this.hurt){
			mez.copy(this.hurtColor).lerp(this.healColor,0.5);
			mez.lerp(this.fillColor, (now-this.hurt)/(this.delay*2));
			mez.lerp(this.fillColor, (now-this.healed)/(this.delay*2))
		}
	}
	else{
		mez.copy(this.fillColor);
	}
	return "#"+mez.getHexString();
		
	/*if(!this.hurt && !this.healed){
		return this.fillColor.getHexString();
	}
	else{
		var now = new Date().getTime();
		if(this.hurt && now > this.hurt+this.delay){
			this.hurt = false;
		}
		if(this.healed && now > this.healed+this.delay){
			this.healed = false;
		}
		else if (){
			var mez = new Color(this.hurtColor).lerp(this.fillColor, (now-this.hurt)/this.delay);
			return mez.getHexString();
		}
	}*/
};

HealthBar.prototype.getUpdatedRatio = function (){
	this.value = this.player.health;
	this.maxValue = this.player.maxHealth;
	if(this.negativeMax < 0){
		if(this.value < 0){
			this.ratio = this.value/this.negativeMax < 1 ? this.value/this.negativeMax : 1;
		}
		else{
			this.ratio = this.value/this.maxValue < 1 ? this.value/this.maxValue : 1;
		}
		return this.ratio;
	}
	else{
		if(this.value <= 0)
			this.ratio = 0;
		else
			this.ratio = this.value/this.maxValue < 1 ? this.value/this.maxValue : 1;
	}
	return this.ratio;
};