var gameX = 600, gameY = 400;
var game, world;
var player;
var bg, dirts, grass;

var WorldGen = function(game, xc, yc, w, h){
    this.game = game;
    this.xc = xc;
    this.yc = yc;
    this.w = w;
    this.h = h;
    this.percent = function(value, percent){
        return (value / 100) * percent;
    };
    this.rand = function(min, max){
        return Math.round(Math.random() * (max - min)) + min;
    };
    this.init = function(){
        this.boundX = this.xc * this.w;
        this.boundY = this.yc * this.h;
        this.game.world.setBounds(0, 0, this.boundX, this.boundY);

        var metre = this.percent(this.yc, 50);
        var dirt, gras;

        dirts = this.game.add.group();
        grass = this.game.add.group();

        for (var x = 0; x < this.xc; x+=1){
            for (var y = 0; y < this.yc; y+=1){
                if (y == metre){
                    gras = grass.create(x * this.w, y * this.h, 'grass');

                    this.game.physics.enable(gras, Phaser.Physics.ARCADE);

                    gras.width = this.w;
                    gras.height = this.h;
                    gras.body.collideWorldBounds = true;
                    gras.body.allowGravity = false;
                    gras.body.bounce.setTo(0.5);
                    gras.body.immovable = true;
                }

                if (y > metre){
                    dirt = dirts.create(x * this.w, y * this.h, 'dirt');

                    this.game.physics.enable(dirt, Phaser.Physics.ARCADE);

                    dirt.width = this.w;
                    dirt.height = this.h;
                    dirt.body.collideWorldBounds = true;
                    dirt.body.allowGravity = false;
                    dirt.body.bounce.setTo(0.5);
                    dirt.body.immovable = true;
                }


            }

            metre += this.rand(-1, 1);
        }

        return this;
    };
};

game = new Phaser.Game(gameX, gameY, Phaser.WEBGL, 'game', {
    preload: function(){

        game.load.spritesheet('player', 'public/phaser_source/img/droid.png', 32, 32, 4);
        game.load.image('background', 'public/phaser_source/img/background.png');
        game.load.image('dirt', 'public/phaser_source/img/dirt.png');
        game.load.image('grass', 'public/phaser_source/img/glass.png');

    },
    create: function(){

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.set(0, 200);

        bg = game.add.tileSprite(0, 0, gameX, gameY, 'background');
        bg.fixedToCamera = true;

        world = new WorldGen(game, 500, 50, 25, 25);
        world.init();

        player = game.add.sprite(100, 100, 'player');

        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.collideWorldBounds = true;
        player.body.bounce.setTo(0.1, 0.3);

        game.camera.follow(player);

    },
    update: function(){

        game.physics.arcade.collideSpriteVsGroup(player, dirts);
        game.physics.arcade.collideSpriteVsGroup(player, grass);
        game.physics.arcade.moveToPointer(player, 200);

    },
    render: function(){

        game.debug.body(dirts);

    }
});