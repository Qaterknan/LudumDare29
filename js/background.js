function Background(options){
	Object2D.call(this, options);

	this.colliding = false;
}

Background.prototype = Object.create( Object2D.prototype );