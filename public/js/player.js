var Player = function (game, playerString, scale, num, layer) {
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.layer = layer
    this.health = 100;
    this.speed = 5;
    this.scale = scale;
    this.center = 0.5;
    this.jumpTimer = 0;

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
        this.player.body.bounce.set(1);
        this.player.body.setSize(20, 32, 5, 16);

        return this.player;
    };
};

Player.prototype.update = function(){
    this.game.physics.arcade.collide(this.player, layer);

    /* keyboard */
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


    //console.log(this.jumpButton);
    /* jumpButton */
    /*if (this.jumpButton.isDown && this.jumpButton <= 300){
        this.jumpTimer += 25;
        this.player.body.velocity.y -= this.jumpTimer;

        //this.jumpTimer = this.player.body.velocity.y;
        console.log(this.jumpTimer);
    }*/
};