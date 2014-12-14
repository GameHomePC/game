(function(random, collisionPacker){

    var State = new function(game){};

    State.Boot = new function(){
        this.preload = function(){

            this.game.add.plugin(Phaser.Plugin.Debug);

            this.game.stage.backgroundColor = '#cc1111';
            this.game.load.image('backgroundLM', 'public/game/img/background3.png');
            this.game.load.image('preload', 'public/game/img/loading/loading.png');
            this.game.load.image('preload2', 'public/game/img/loading/loading2.png');
        };
        this.create = function(){
            this.game.state.start('Load');
        };
    };

    State.Load = new function(){
        this.preload = function(){

            var world = this.game.world;
            var worldW = world.width;
            var worldH = world.height;

            var text = this.game.add.text(worldW / 2, worldH / 2, 'ЗАГРУЗКА', { fill: 'white' });
            var preloading = this.game.add.sprite(worldW / 2, worldH / 2, 'preload');
            var preloading2 = this.game.add.sprite(worldW / 2, worldH / 2, 'preload2');

            preloading.y -= preloading.height / 2;
            preloading2.y -= preloading2.height / 2;
            preloading.x -= preloading.width / 2;
            preloading2.x -= preloading2.width / 2;
            text.x -= text.width / 2;
            text.y += 20;

            this.game.load.setPreloadSprite(preloading);

            this.game.load.image('background', 'public/game/img/background2.png');
            this.game.load.image('reserve', 'public/game/img/Reserve_Bubble.png');
            this.game.load.image('box', 'public/game/img/box.png');

            /* audio */
            this.game.load.audio('music', ['public/game/audio/music.wav']);
            this.game.load.audio('musicMenu', ['public/game/audio/menu/audio-menu.mp3']);

            /* button */
            this.game.load.spritesheet('buttonMenu', 'public/game/img/button/menu-buttonMain.png', 143, 28);
            this.game.load.spritesheet('buttonAudio', 'public/game/img/button/toggle-audio.png', 67, 67);

            this.game.load.tilemap('map', 'public/game/json/level-1.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('terrain', 'public/game/img/terrain.png');
            this.game.load.image('tiles', 'public/game/img/tiles.png');
            this.game.load.image('background', 'public/game/img/background.jpg');


        };
        this.create = function(){
            this.game.state.start('Menu');
        };
    };

    State.Menu = new function(){
        this.create = function(){
            var _this = this;

            var world = this.game.world.camera;
            var worldW = world.width;
            var worldH = world.height;

            /* background */
            this.backgroundFon = this.game.add.tileSprite(0, 0,worldW, worldH, 'backgroundLM');

            var cloud = this.cloud = this.game.add.group();
            for(var i = 0; i < 30; i++){
                var cloudInit = cloud.create(random(0, window.innerWidth),random(0, 100), 'reserve');
                cloudInit.scale.set(0.1);
            }
            /* end background */

            /* audio menu */
            var statusMusic = false;
            var music = this.game.add.audio('musicMenu');
            music.autoplay = true;

            var buttonAudio = this.game.add.button(worldW - 45, 10, 'buttonAudio', toggleAudio , this);
            buttonAudio.scale.set(0.5);
            music.play('', 1, true);

            console.log(music);

            function toggleAudio(){

                if(statusMusic == true){
                    music.volume = 1;
                    statusMusic = false;
                    buttonAudio.frame = 0;
                } else {
                    music.volume = 0;
                    statusMusic = true;
                    buttonAudio.frame = 1;
                }
            }
            /* end audio menu */

            /* button */
            var menuItem = [{
                title: 'Играть',
                state: 'Play'
                },
                {
                    title: 'Настройки',
                    state: 'Setting'
                }];
            var indent = 20;

            function up(button){
                this.game.state.start(button._state);
            }

            for(var m = 0; m < menuItem.length; m++){
                var data = menuItem[m];
                var button = this.game.add.button(worldW / 2, indent + 250, 'buttonMenu', up , this, 2,1,0);

                button._state = data.state;
                button.y += (button.height * m) + (m * indent);

                button.scale.set(1.5);
                button.anchor.set(0.5);

                var text = this.add.text(worldW / 2, indent + 250, data.title, { fill: 'white' });
                text.y += (text.height * m) + (m * indent);
                text.anchor.set(0.5);
            }
            /* end button */

        };

        this.update = function(){
            this.cloud.forEachAlive(function(sprite){
                if(sprite.position.x >= window.innerWidth){
                    sprite.position.x = -sprite.width;
                    sprite.position.y = random(0, 300);
                } else {
                    sprite.position.x += 4;
                }
            });

            this.backgroundFon.tilePosition.x += 2;
        }
    };

    State.Play = new function(){
        this.create = function(){
            this.optionsPlay = {};

            this.optionsSet = function(key, value){
                this.optionsPlay[key] = value;
                return this.optionsPlay[key];
            };

            this.optionsGet = function(key){
                return this.optionsPlay[key];
            };

            var packer = new collisionPacker(this.game);

            var world = this.game.world;
            var worldW = world.width;
            var worldH = world.height;

            var bg = this.optionsSet('bg', this.game.add.tileSprite(0, 0, worldW, worldH, 'background'));
            bg.fixedToCamera = true;

            var map = this.optionsSet('map', this.game.add.tilemap('map'));
            map.addTilesetImage('terrain');

            var layer = this.optionsSet('layer', map.createLayer('layer'));
            layer.resizeWorld();

            var box = this.optionsSet('box', this.game.add.sprite(100, 100, 'box'));
            var boxGroup = this.optionsSet('boxGroup', this.game.add.group());


            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 500;

            this.game.physics.p2.convertTilemap(map, layer);

            this.game.physics.p2.enable(box, false);

            var body = packer.setObjectCollision(map, 'collision', false);
            var laye = packer.setTileCollision(map, 'layer');
            var ind = packer.setTileIndexCollision(map, 'layer', [68]);

            packer.setEventIndexContact(map, 'layer', [68], function(){
                console.log(1);
            });

            box.body.onBeginContact.add(function(body){
                console.log(arguments);
            });

            var material = body.material;



            box.body.setRectangle(50, 50);
            box.width = 50;
            box.height = 50;

            var playerMaterial = this.game.physics.p2.createMaterial('playerMaterial');
            var playerBody = [];

            playerBody.push(box.body);

            for (var xBox = 0; xBox < 20; xBox+=1){
                var bounds = this.game.world.bounds;
                var dataXBox = boxGroup.create(random(0, bounds.width), random(0, 200), 'box');
                this.game.physics.p2.enable(dataXBox, false);

                var w = random(50, 80);
                var h = random(50, 80);

                dataXBox.width = w;
                dataXBox.height = h;
                dataXBox.body.setRectangle(w, h);

                playerBody.push(dataXBox.body);


            }

            this.game.physics.p2.setMaterial(playerMaterial, playerBody);

            var contactDirt = this.game.physics.p2.createContactMaterial(playerMaterial, material.dirt, {
                friction: 1,
                restitution: 0
            });

            var contactLed = this.game.physics.p2.createContactMaterial(playerMaterial, material.led, {
                friction: 0.1
            });

            var contactMatras = this.game.physics.p2.createContactMaterial(playerMaterial, material.matras, {
                friction: 1,
                restitution: 1
            });

            var contactBox = this.game.physics.p2.createContactMaterial(playerMaterial, playerMaterial, {
                friction: 1,
                restitution: 0,
                stiffness: 100000
            });

            this.game.camera.follow(box);

            var cursors = this.optionsSet('cursors', this.game.input.keyboard);
            var activeKey = this.optionsSet('activeKey', Phaser.Keyboard);

        };
        this.update = function(){
            var box = this.optionsGet('box');
            var cursors = this.optionsGet('cursors');
            var activeKey = this.optionsGet('activeKey');

            if (cursors.isDown(activeKey.A) || cursors.isDown(activeKey.LEFT)){
                box.body.moveLeft(200);
            } else if (cursors.isDown(activeKey.D) || cursors.isDown(activeKey.RIGHT)){
                box.body.moveRight(200);
            }

            if(cursors.isDown(activeKey.ENTER)){
                this.game.state.start('Menu');
            }

            if(cursors.isDown(activeKey.SPACEBAR)){
                box.body.moveUp(200);
            }

        }
    };

    var w = 800, h = 600;
    var game = new Phaser.Game(w, h, Phaser.AUTO, 'game');

    game.state.add('Boot', State.Boot);
    game.state.add('Load', State.Load);
    game.state.add('Menu', State.Menu);
    game.state.add('Play', State.Play);

    game.state.start('Boot');

})(random, collisionPacker);
