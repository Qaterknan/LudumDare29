function Weapon(options){
	this.options = options || {};

	this.textureName = options.textureName;
	this.shootingSoundName = options.shootingSoundName === undefined ? "genericShot" : options.shootingSoundName;
	
	this.lastShotTime = 0;
	if(options.reloads)
		this.clip = options.clipSize;
}

Weapon.prototype.shoot = function(holder, parent) {
	var now = Date.now();
	var shootDelay = 1000/this.options.rof;
	if(this.options.reloads && this.clip <= 0){
		shootDelay += this.options.reloadDelay;
	}
	if(now - this.lastShotTime > shootDelay){
		if(this.options.reloads && this.clip <= 0){
			this.clip = this.options.clipSize;
		}

		this.lastShotTime = now;
		game.loader.get(this.shootingSoundName).play();
		var bullet = new Bullet({
			texture: new Texture(game.loader.get(this.options.bullet.textureName), this.options.bullet.textureOptions),
			width: this.options.bullet.width,
			height: this.options.bullet.height,
			position: new Vec2().copy(holder.position),
			velocity: new Vec2(holder.lookingDirection*this.options.bullet.speed, utils.randFloatSpread(this.options.inaccuracy)),
			holder : holder,
		});
		// bullet.debug = true;
		parent.add(bullet);

		this.clip--;
	}
};

weapons = {
	pistol: new Weapon({
		textureName: "pistol",
		shootingSoundName: "genericShot",//"pistol-shoot",
		reloadingSoundName: "pistol-reload",
		name: "Handgun",
		description: "Your grandma's handgun. Pretty much useless.",

		damage: 5, // per hit
		rof: 20, // per second
		inaccuracy: 50,
		recoil: new Vec2(800, 0),
		bullet: {
			speed: 700, // px/s
			width: 8,
			height: 8,
			textureName: "pistol-bullet",
			textureOptions: {
				totalFrames: 6,
				currentAnimation: "birth",
				animations: {
					"static" : {
						delay: 50,
						start: 2,
						end: 2
					},
					"birth" : {
						delay: 15,
						start: 0,
						end: 1,
						cycle: false
					},
					"destroy" : {
						delay: 50,
						start: 2,
						end: 5,
						cycle: false
					},
				}
			}
		},
		reloads: false,
		clipSize: 6,
		reloadDelay: 1000, // ms
		overheats: false,
		overheatDelay: 0,
	})
};