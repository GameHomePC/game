var collisionPacker = function(game){
    this.game = game;

    this.contactSpriteAndGroup = function(obj, group, callback){
        var _this = this;

        group.forEachAlive(function(spriteGroupAlive){
            _this.contactSpriteVsSprite(obj, spriteGroupAlive, callback);
        });
    };

    this.contactSpriteVsSprite = function(obj1, obj2, callback){
        var obj1Bounds = obj1.getBounds();
        var obj2Bounds = obj2.getBounds();
        if (obj1Bounds.intersects(obj2Bounds, true)){
            callback(obj1, obj2);
        }
    };

    this.getObjectLayer = function(map, layer){
        var objects = map.objects;
        return objects[layer];
    };

    this.objectCollision = function(map, layer, addToWorld){
        var bodies = [];
        var material = {};

        if (typeof addToWorld === 'undefined') { addToWorld = true; }

        var collisionObject = this.getObjectLayer(map, layer);

        var mapPointToArray = function(object){
            return [object[0], object[1]];
        };

        for (var i = 0, len = collisionObject.length; i < len; i+=1){

            var object = collisionObject[i];
            var prop = object.properties;

            var body = this.game.physics.p2.createBody(object.x, object.y, 0, false);

            if (object.polygon || object.polyline) {
                var mapArray = (object.polygon || object.polyline).map(mapPointToArray);

                if (!body.addPolygon(null, mapArray)) {
                    console.warn('Unable to add poly collision body for object:', object);
                    continue;
                }
            }

            else if (object.ellipse) {
                body.addCircle(object.width, object.width / 2, object.width / 2, object.rotation);
            }
            // no polygon, use rectangle defined by object itself
            else {
                body.addRectangle(object.width, object.height, object.width / 2, object.height / 2, object.rotation);
            }

            if (addToWorld){
                this.game.physics.p2.addBody(body);
            }

            bodies.push(body);

            if (prop && prop.type){
                if (material[prop.type]){
                    material[prop.type].push(body);
                } else {
                    material[prop.type] = [];
                    material[prop.type].push(body);
                }
            }


        }

        return {
            body: bodies,
            material: material
        };

    };
};






(function(win, doc){

    var game, cursors, packer, activeKey;
    var w = 1000, h = 500, renderer = Phaser.AUTO, parent = 'game';
    var playerJumpCount = 0, sound = true;;
    var PHYSICS = Phaser.Physics.P2JS;

    var player, playerMaterial, worldMaterial, map, layer, coins, coin, coinAudio, coinText, objectCoin;
    var jumpButton, jumpTimer = 0;
    var xMaterial, zMaterial;

    function checkIfCanJump() {

        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;

        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
        {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];

            if (c.bodyA === player.body.data || c.bodyB === player.body.data)
            {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === player.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        }

        return result;

    }



    var ui = {
        coins: {
            setCoins: function(){
                this.count += 1;
                this.obj.setText(this.text());
                return this;
            },
            x: 10,
            y: 10,
            count: 0,
            textAfter: 'Монеты: ',
            text: function(){
                return this.textAfter + this.count;
            },
            style: {
                font: '14px Verdana',
                fill: 'white',
                align: 'left'
            }
        }
    };

    game = new Phaser.Game(w, h, renderer, parent, {
        preload: function(){

            game.load.tilemap('level-1', 'public/game/json/level-1.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('terrain', 'public/game/img/terrain.png');

            game.load.image('player', 'public/game/img/player.png');
            game.load.spritesheet('coin', 'public/game/img/coin_tile.png', 32, 32, 8);
            game.load.audio('coin_sound', ['public/game/audio/coin.mp3', 'public/game/audio/coin.waw']);

        },
        create: function(){



            packer = new collisionPacker(game);

            player = game.add.sprite(150, 150, 'player');
            coins = game.add.group();
            coins.z = 10;
            coinAudio = game.add.audio('coin_sound');
            coinText = game.add.text(ui.coins.x, ui.coins.y, ui.coins.text(), ui.coins.style);
            coinText.fixedToCamera = true;
            ui.coins.obj = coinText;




            map = game.add.tilemap('level-1');


            objectCoin = packer.getObjectLayer(map, 'coin');



            map.addTilesetImage('terrain');
            layer = map.createLayer('layer');
            layer.resizeWorld();
            game.physics.startSystem(PHYSICS);



            game.physics.p2.gravity.y = 2000;
            game.physics.p2.setImpactEvents(true);

            game.physics.p2.enable(player, false);

            playerMaterial = game.physics.p2.createMaterial('playerMaterial', player.body);
            xMaterial = game.physics.p2.createMaterial('xMaterial');
            zMaterial = game.physics.p2.createMaterial('zMaterial');


            var bodyObject = packer.objectCollision(map, 'collision', true).material;

            game.physics.p2.setMaterial(xMaterial, bodyObject.x);
            game.physics.p2.setMaterial(zMaterial, bodyObject.z);

            game.camera.follow(player);



            if (objectCoin.length){
                for (var x = 0, len = objectCoin.length; x < len; x+=1){
                    var data = objectCoin[x];

                    coin = coins.create(data.x + 16, data.y + 16, 'coin');
                    game.physics.p2.enable(coin, false);
                    coin.body.setCircle(16);
                    coin.body.damping = 0;
                    coin.body.static = true;
                    coin.body.fixedRotation = true;
                    coin.body.data.shapes[0].sensor = true;
                    coin.animations.add('coin');
                    coin.animations.play('coin', 15, true);
                }
            }



            player.body.damping = 0.1;
            player.body.kinematic = false;
            player.body.mass = 1;
            player.body.fixedRotation = false;


            var createX = game.physics.p2.createContactMaterial(playerMaterial, xMaterial);
            var createZ = game.physics.p2.createContactMaterial(playerMaterial, zMaterial);


            createZ.friction = 1;
            createX.friction = 0.2;


            player.body.onBeginContact.add(function(body){
                if (body && body.sprite){
                    var sprite = body.sprite;
                    if (sprite && sprite.alive){
                        var key = sprite.key;
                        if (key == 'coin'){
                            ui.coins.setCoins();
                            coinAudio.play();
                            sprite.kill();
                        }
                    }
                }
            });


            cursors = game.input.keyboard;
            activeKey = Phaser.Keyboard;
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        },
        update: function() {

            if (cursors.isDown(activeKey.A) || cursors.isDown(activeKey.LEFT)) {
                player.body.moveLeft(150);
            } else if (cursors.isDown(activeKey.D) || cursors.isDown(activeKey.RIGHT)) {
                player.body.moveRight(150);
            }

            if (cursors.isDown(activeKey.SPACEBAR) && game.time.now > jumpTimer && checkIfCanJump()) {
                player.body.moveUp(300);
                jumpTimer = game.time.now + 750;
            }

            /*if (cursors.isDown(activeKey.SPACEBAR)) {

                player.body.moveUp(300);
                //if (sound) this.jump_s.play();
                playerJumpCount = 1;
            } else if (cursors.isDown(activeKey.SPACEBAR) && playerJumpCount < 12 && playerJumpCount != 0) {
                playerJumpCount += 1;
                player.body.moveUp(300);
                console.log(checkIfCanJump());
            } else {
                playerJumpCount = 0;
            }*/

        }
    });

})(window, document);