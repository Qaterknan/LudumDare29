function ProgressBar(options){
	Object2D.call(this, options);

	this.fillColor = options.fillColor === undefined ? "#0f0" : options.fillColor;
	this.bgColor = options.bgColor === undefined ? "#000" : options.bgColor;
	this.negativeColor = options.negativeColor === undefined ? "#f00" : options.negativeColor;
	
	this.value = options.value === undefined ? 100 : options.value;
	this.maxValue = options.maxValue === undefined ? 100 : options.maxValue;
	this.negativeMax = options.negativeMaxValue = undefined ? 0 : options.negativeMaxValue;
	
	this.offset = options.offset === undefined ? 2 : options.offset;
	
	this.ratio = 0;
}

ProgressBar.prototype = Object.create( Object2D.prototype );

ProgressBar.prototype.render = function(ctx) {
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.rotation);
	ctx.fillStyle = this.bgColor;
	ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
	ctx.fillStyle = this.value > 0 ? this.fillColor : this.negativeColor;
	ctx.fillRect(-this.width/2+this.offset, -this.height/2+this.offset,(this.width-2*this.offset)*this.getUpdatedRatio(), this.height-2*this.offset);
	ctx.restore();
	Object2D.prototype.render.call(this, ctx);
};

ProgressBar.prototype.getUpdatedRatio = function (){
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