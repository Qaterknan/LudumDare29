function TweenManager(game){
    this.tweens = [];

    this.game = game;
}

TweenManager.prototype.tween = function(object) {
    return new Tween(object, this.game, this);
};

TweenManager.prototype.update = function() {
    for(var i=this.tweens.length-1; i>=0; i--){
        if(!this.tweens[i].update(this.game.time)){
            this.tweens.splice(i, 1);
        }
    }
};