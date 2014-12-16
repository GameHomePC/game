var state = (function(){

    function State(){}

    State.prototype = {
        Boot: {
            preload: function(){},
            create: function(){
                this.game.state.start('Load');
            }
        },
        Load: {
            preload: function(){
                var game = this.game;
                var load = game.load;

                game.add.plugin(Phaser.Plugin.Debug);

                load.image('background-1', 'public/game/img/Background01.png');
                load.image('background-2', 'public/game/img/Background02.png');
                load.image('background-3', 'public/game/img/Background03.png');
                load.image('background-4', 'public/game/img/Background04.png');
                load.image('background-5', 'public/game/img/Background05.png');

                load.audio('coin', ['public/game/audio/coin.wav']);
                load.audio('sound', ['public/game/audio/audio-menu.mp3']);

                load.spritesheet('player', 'public/game/img/player_2.png', 32, 50, 15);
                load.spritesheet('cow', 'public/game/img/cow.png', 192, 128, 8);
                load.spritesheet('coin', 'public/game/img/Coins.png', 64, 64, 12);

                load.tilemap('map', 'public/game/json/main.json', null, Phaser.Tilemap.TILED_JSON);
                load.image('tile-1', 'public/game/img/tile-1.png');

            },
            create: function(){
                this.game.state.start('Play');
            }
        },
        Menu: {
            create: function(){}
        },
        Play: {
            create: function(){
                var game = this.game;
                var camera = game.camera;
                var physics, physicsArcade;
                var packer = new collisionPacker(game);

                game.physics.startSystem(Phaser.Physics.ARCADE);
                physics = game.physics;
                physicsArcade = this.physicsArcade = physics.arcade;
                physicsArcade.gravity.y = 500;



                var bg = game.add.tileSprite(0, 0, camera.width, camera.height, 'background-2');
                bg.width = camera.width;
                bg.height = camera.height;
                bg.fixedToCamera = true;

                this.facing = 'idle';
                this.jumpCounter = 0;
                this.maxJumlCounter = 7;
                this.jumpStep = 64;
                this.coinAudio = game.add.sound('coin', 1, false);
                this.soundCheck = false;
                this.soundMenu = game.add.sound('sound', 1, true);

                if (!this.soundCheck){
                    this.soundCheck = true;
                    this.soundMenu.play('', 0, 1, true);
                    console.log(this);
                }

                var map = game.add.tilemap('map');
                map.addTilesetImage('tile-1');

                var layer = this.layer = map.createLayer('tiles');
                layer.resizeWorld();
                // layer.debug = true;


                map.setCollisionByExclusion([]);

                var coins = this.coins = game.add.group();
                coins.enableBody = true;
                coins.physicsBodyType = Phaser.Physics.ARCADE;

                map.createFromObjects('coins', 34, 'coin', 0, true, false, coins);

                coins.setAll('body.allowGravity', false);
                coins.callAll('animations.add', 'animations', 'spin');
                coins.callAll('animations.play', 'animations', 'spin', 32, true);

                var player = this.player = this.player = game.add.sprite(2700, 2200, 'player');
                player.animations.add('right', [9, 10, 11], 5, true);
                player.animations.add('left', [5, 6, 7], 5, true);

                physics.enable(player);

                player.body.collideWorldBounds = true;

                camera.follow(player);

                var cursors = this.cursors = game.input.keyboard.createCursorKeys();
                var space = this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            },
            update: function(){
                var arcade = this.physicsArcade;
                var cursors = this.cursors;
                var player = this.player;
                var animations = player.animations;

                arcade.collide(player, this.layer);
                arcade.overlap(player, this.coins, function(player, coin){
                    coin.kill();
                    this.coinAudio.play('', 0, 1, false);
                }, null, this);

                player.body.velocity.x = 0;

                if (cursors.right.isDown){
                    player.body.velocity.x = 200;
                    if (this.facing != 'right' && player.body.onFloor()){
                        animations.play('right');
                        this.facing = 'right';
                    }
                } else if (cursors.left.isDown){
                    player.body.velocity.x = -200;
                    if (this.facing != 'left' && player.body.onFloor()){
                        animations.play('left');
                        this.facing = 'left';
                    }
                } else {
                    if (this.facing != 'idle'){
                        player.animations.stop();
                        player.frame = (this.facing == 'right') ? 8 : 4;
                        this.facing = 'idle';
                    }
                }

                if (this.space.isUp && !player.body.onFloor()){
                    this.jumpCounter = 0;
                }

                if (this.space.isDown && player.body.onFloor() && this.jumpCounter == 0){
                    player.body.velocity.y -= this.jumpStep;
                    player.animations.stop();
                    player.frame = 0;
                    this.jumpCounter = 1;
                } else if (this.space.isDown && this.jumpCounter < this.maxJumlCounter && this.jumpCounter != 0){
                    player.body.velocity.y -= this.jumpStep;;
                    this.jumpCounter += 1;
                }

            }
        }
    };

    return new State();

})();