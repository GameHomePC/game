(function(){

    var collisionPacker = function(game){
        this.game = game;

        this.getObjectLayer = function(map, layer){
            var objects = map.objects;
            return objects[layer];
        };

        this.layerCollision = function(map, layer, indexArray, addToWorld){
            indexArray = indexArray || [];
            addToWorld = addToWorld || true;

            var layersMap = map.layers;
            var currentLayer;

            if (layersMap && layersMap.length){

                for (var x = 0, len = layersMap.length; x < len; x+=1){
                    var data = layersMap[x];
                    if (data.name == layer){
                        currentLayer = data;
                        break;
                    }
                }

                if (currentLayer){

                    var bodies = currentLayer.bodies = [];
                    var ex = [];

                    for (var yC = 0, yLen = currentLayer.height; yC < yLen; yC+=1){
                        for (var xC = 0, xLen = currentLayer.width; xC < xLen; xC+=1){
                            var dataTiles = currentLayer.data[yC][xC];
                            var index = dataTiles.index;
                            var properties = dataTiles.properties;

                            if (dataTiles && ((properties && properties.collide == 'yes') || indexArray.length && indexArray.indexOf(index) > -1 && ex.indexOf(index) === -1)){
                                var body = this.game.physics.p2.createBody(dataTiles.worldX, dataTiles.worldY, 0, true);
                                body.addRectangle(dataTiles.width, dataTiles.height, dataTiles.width / 2, dataTiles.height / 2);
                            }

                        }
                    }

                }
            }

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

            var createMaterial = function(game, material){
                var materialBody = {};

                for (var prop in material){
                    if (material.hasOwnProperty(prop)){
                        if (!materialBody[prop]){
                            materialBody[prop] = game.physics.p2.createMaterial(prop);
                        }
                    }
                }

                for (var prop2 in material){
                    if (material.hasOwnProperty(prop2)){
                        var data = material[prop2];
                        var mat = materialBody[prop2];
                        if (data && data.length && mat){
                            game.physics.p2.setMaterial(mat, data);
                        }
                    }
                }

                return materialBody;
            };

            return {
                body: bodies,
                material: createMaterial(game, material),
                debug: function(debug){
                    debug = debug || false;

                    for (var x = 0; x < this.body.length; x+=1){
                        this.body[x].debug = debug;
                    }
                }
            };

        };
    };

    var random = function(min, max){
        return Math.round(Math.random() * (max - min)) + min;
    };




    var backgroundTile, backgroundFon;

    var State = new function(){};

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
            this.game.load.audio('music', ['public/game/audio/music.wav']);

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

            var world = this.game.world;
            var worldW = world.width;
            var worldH = world.height;

            /* background */

            backgroundFon = this.game.add.sprite(0, 0, 'backgroundLM');
            backgroundFon.height = worldH;
            backgroundFon.width = worldW;

            var cloud = this.cloud = this.game.add.group();
            for(var i = 0; i < 30; i++){
                var backgroundTile = cloud.create(random(0, window.innerWidth),random(0, 100), 'reserve');
                backgroundTile.scale.set(0.1);
            }

            /* end background */

            var menu = {
                items: {
                    play: 'Играть',
                    cont: 'Продолжить',
                    exit: 'Выход',
                    exit2: 'Выход 2'
                },
                start: function(_this, game, x, y, margin){
                    var items = this.items;
                    var num = 0;
                    for (var prop in items){
                        if (items.hasOwnProperty(prop)){
                            var text = game.add.text(x, y, items[prop], {
                                fill: 'white'
                            });

                            text._keyItem = prop;

                            text.inputEnabled = true;

                            text.y += (text.height * num) + (margin * num);

                            (function(_this, text){

                                text.events.onInputDown.add(function(text){

                                    var key = text._keyItem;
                                    if (key == 'play'){
                                        _this.game.state.start('Play');
                                    }

                                }, _this);

                            })(_this, text);

                            num += 1;
                        }
                    }
                }
            };

            menu.start(_this, this.game, 10, 10, 10);

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

            var body = packer.objectCollision(map, 'collision', false);
            var laye = packer.layerCollision(map, 'layer', [68], true);

            var material = body.material;

            this.game.physics.p2.enable(box, false);

            box.body.setRectangle(100, 100);
            box.width = 100;
            box.height = 100;

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

    var w = window.innerWidth, h = window.innerHeight;
    var game = new Phaser.Game(w, h, Phaser.AUTO, 'game');

    game.state.add('Boot', State.Boot);
    game.state.add('Load', State.Load);
    game.state.add('Menu', State.Menu);
    game.state.add('Play', State.Play);

    game.state.start('Boot');

})();