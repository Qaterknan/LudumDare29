function Platform(options){
	Object2D.call(this, options);

	this.colliding = true;
}

Platform.prototype = Object.create( Object2D.prototype );