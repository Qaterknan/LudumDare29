function Loader(){
	this.cache = {};

	this.toLoad = 0;
	this.loaded = 0;
	this.loading = false;

	this.imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

	var _this = this;
}

Loader.prototype.loadOne = function(src, name, callback) {
	var srcArray = src.split(".");
	var ext = srcArray[srcArray.length-1];

	if(this.imageExts.indexOf(ext) > -1){
		this.cache[name] = new Image();
		this.cache[name].onload = callback;
		this.cache[name].src = src;
	}

	return this.cache[name];
};

Loader.prototype.load = function(assets, callback) {
	var _this = this;
	if(!this.loading){
		this.toLoad = 0;
		this.loading = true;
		for(var i in assets){
			this.loadOne(assets[i], i, function(){
				_this.loaded++;
				if(_this.loaded >= _this.toLoad){
					this.loading = false;
					callback(_this);
				}
			});
			this.toLoad++;
		}
	}
	else {
		console.log("loading already in progress");
	}

	return this.cache;
};

Loader.prototype.get = function(name) {
	return this.cache[name];
};

Loader.prototype.reset = function() {
	this.loading = false;
	this.cache = {};
	this.toLoad = 0;
	this.loaded = 0;
};