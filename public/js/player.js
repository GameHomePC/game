var Player = function (game, playerString, scale, num, layer) {
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.layer = layer
    this.health = 100;
    this.speed = 150;
    this.scale = scale;
    this.center = 0.5;
    this.jumpTimer = 0;
    this.maxJump = 200;

    this.facing = false;
    this.player = this.game.add.sprite(x, y, playerString);
    this.anim = this.player.animations.add('turn', [num], 20, true);
    this.animActive = this.player.animations.add('active');
    this.keyboard = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.getPlayer = function(){
        this.player.anchor.set(this.center);
        this.player.scale.set(this.scale);

        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.set(0, 0);
        this.player.body.bounce.setTo(0, 0.2);
        this.player.body.setSize(32, 32, 0, 0);

        return this.player;
    };
};

Player.prototype.update = function(){
    this.game.physics.arcade.collide(this.player, this.layer, function(){
        console.log(arguments);
    });

    this.player.body.velocity.x = 0;

    /* keyboard */
    if(this.keyboard.left.isDown){
        this.player.body.velocity.x -= this.speed;
        this.player.scale.x = -this.scale;

        if(this.facing == false){
            this.animActive.play(30, true);
            this.facing = true;
        }

    } else if(this.keyboard.right.isDown){
        this.player.body.velocity.x += this.speed;
        this.player.scale.x = this.scale;

        if(this.facing == false){
            this.animActive.play(30, true);
            this.facing = true;
        }
    } else {
        this.anim.play('turn');
        this.facing = false;
    }


    if (this.jumpButton.isDown){

        var number = this.player.body.velocity.y -= 10;

        if (Math.abs(number) >= this.maxJump){
            this.player.body.velocity.y = 0;
        }
    }
};