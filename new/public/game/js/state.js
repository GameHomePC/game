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

                load.spritesheet('player', 'public/game/img/player_2.png', 32, 50, 15);

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
                var physics;
                var packer = new collisionPacker(game);

                this.facing = 'idle';

                var map = game.add.tilemap('map');
                map.addTilesetImage('tile-1');

                var layer = map.createLayer('tiles');
                layer.resizeWorld();

                game.physics.startSystem(Phaser.Physics.P2JS);
                physics = game.physics.p2;
                physics.gravity.y = 500;

                var bodyObjectLayer = packer.setObjectCollision(map, 'collision');
                var materials = bodyObjectLayer.material;

                console.log(bodyObjectLayer);

                var player = this.player = this.player = game.add.sprite(2700, 2200, 'player');
                player.animations.add('right', [9, 10, 11], 5, true);
                player.animations.add('left', [5, 6, 7], 5, true);

                physics.enable([player], false);
                player.body.fixedRotation = true;
                player.body.mass = 2;

                var playerMaterial = physics.createMaterial('PlayerMaterial', player.body);
                var contactPlayerAndDirtMaterial = physics.createContactMaterial(playerMaterial, materials.dirt, {
                    friction: 1,
                    frictionRelaxation: 1,
                    restitution: 0
                });

                console.log(contactPlayerAndDirtMaterial);

                camera.follow(player);

                var cursors = this.cursors = game.input.keyboard.createCursorKeys();
            },
            update: function(){
                var cursors = this.cursors;
                var player = this.player;
                var animations = player.animations;

                if (cursors.right.isDown){
                    player.body.velocity.x = 100;
                    if (this.facing != 'right'){
                        animations.play('right');
                        this.facing = 'right';
                    }
                } else if (cursors.left.isDown){
                    player.body.velocity.x = -100;
                    if (this.facing != 'left'){
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

            }
        }
    };

    return new State();

})();