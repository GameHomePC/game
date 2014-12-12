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

        if (typeof addToWorld === 'undefined') { addToWorld = true; }

        var collisionObject = this.getObjectLayer(map, layer);

        var mapPointToArray = function(object){
            return [object[0], object[1]];
        };

        for (var i = 0, len = collisionObject.length; i < len; i+=1){

            var object = collisionObject[i];

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


        }

    };
};






(function(win, doc){

    var game, cursors, packer;
    var w = 1000, h = 500, renderer = Phaser.AUTO, parent = 'game';

    var PHYSICS = Phaser.Physics.P2JS;

    var player, map, layer, coins, coin, coinAudio, coinText, objectCoin;


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



            game.physics.p2.gravity.y = 200;
            game.physics.p2.setImpactEvents(true);

            game.physics.p2.enable(player, false);


            packer.objectCollision(map, 'collision', true);

            game.camera.follow(player);
            cursors = game.input.keyboard.createCursorKeys();


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


        },
        update: function(){



            if (cursors.left.isDown){
                player.body.moveLeft(150);
            }

            if (cursors.right.isDown){
                player.body.moveRight(150);
            }

            if (cursors.up.isDown){
                player.body.moveUp(150);
            }

            if (cursors.down.isDown){
                player.body.moveDown(150);
            }

        }
    });

})(window, document);