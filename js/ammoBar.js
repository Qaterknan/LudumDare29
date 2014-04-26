function AmmoBar(options){
	ProgressBar.call(this, options);

	this.weapon = options.weapon === undefined ? {clip : 25, options:{clipSize: 25}} :  options.weapon;
	this.weapon.ammoBar = this;
	
	this.fillColor = "#FFD117";
	this.negativeMax = -1;
	
}

AmmoBar.prototype = Object.create( ProgressBar.prototype );

AmmoBar.prototype.getUpdatedRatio = function (){
	this.value = this.weapon.clip;
	this.maxValue = this.weapon.options.clipSize;
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