var player = function (game, playerString, scale) {
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 100;
    this.speed = 5;
    this.scale = scale;
    this.center = 0.5;

    this.facing = false;
    this.player = this.game.add.sprite(x, y, playerString);
    this.anim = this.player.animations.add('turn', [3], 20, true);
    this.animActive = this.player.animations.add('active');
    this.keyboard = game.input.keyboard.createCursorKeys();
    this.getPlayer = function(){
        this.player.anchor.set(this.center);
        this.player.scale.set(this.scale);
    };
};

player.prototype.update = function(){
    if(this.keyboard.left.isDown){
        this.player.position.x -= this.speed;
        this.player.scale.x = -this.scale;

        if(this.facing == false){
            this.animActive.play(30, true);
            this.facing = true;
        }

    } else if(this.keyboard.right.isDown){
        this.player.position.x += this.speed;
        this.player.scale.x = this.scale;

        if(this.facing == false){
            this.animActive.play(30, true);
            this.facing = true;
        }
    } else {
        this.anim.play('turn');
        this.facing = false;
    }
};